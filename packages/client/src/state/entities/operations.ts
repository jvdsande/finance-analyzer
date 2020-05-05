/* eslint-disable max-classes-per-file */
import { Client, OperationAccessor } from 'accessors'
import {
  observable, action, reaction, when, runInAction, computed,
} from 'mobx'
import moment from 'moment'
import { act } from 'react-dom/test-utils'
import StateSession from 'state/entities/session'

type CategoryRepartition = {
  category: {
    _id: string
    name: string
  }
  value: number
}

type MonthlyAnalysis = {
  totalEarned: number
  totalSpent: number
  gain: number

  monthlySpending: number
  otherSpending: number

  yearlyCumulativeEarning: number
  yearlyCumulativeSpending: number
  yearlyCumulativeGain: number

  yearlyNecessaryRaise: {
    zero: number
    goal: number
  }

  categoryRepartition: {
    all: CategoryRepartition[]
    monthly: CategoryRepartition[]
    normal: CategoryRepartition[]
    exceptional: CategoryRepartition[]
  }
  typeRepartition: {
    monthly: number
    normal: number
    exceptional: number
  }
}

type WeeklyAnalysis = {
  totalEarned: number
  totalSpent: number
  gain: number

  yearlyCumulativeEarning: number
  yearlyCumulativeSpending: number
  yearlyCumulativeGain: number
}

type DailyAnalysis = {
  yearlyCumulativeEarning: number
  yearlyCumulativeSpending: number
  yearlyCumulativeGain: number
}

class StateMonth {
  @observable value ?: MonthlyAnalysis

  date : moment.Moment

  constructor(month: number, year: moment.Moment) {
    this.date = moment(year).month(month).startOf('month').add(7, 'days')
  }
}

class StateWeek {
  @observable value ?: WeeklyAnalysis

  date : moment.Moment

  constructor(week: number, year: moment.Moment) {
    this.date = moment(year).week(week).startOf('week').add(3, 'days')
  }
}

class StateDay {
  @observable value ?: DailyAnalysis

  date : moment.Moment

  constructor(date: moment.Moment) {
    this.date = moment(date).startOf('day')
  }
}

export default class StateOperations {
  @observable year = moment()

  @observable months : StateMonth[] = []

  @observable weeks : StateWeek[] = []

  @observable days : StateDay[] = []

  @observable operations : any[] = []

  constructor(sessionState : StateSession) {
    const operationSubscriptions = OperationAccessor.query
      .readMany
      .where({
        _operators: {
          date: {
            gte: moment(this.year).startOf('year').toISOString(),
            lte: moment(this.year).endOf('year').toISOString(),
          },
        },
      })
      .select({
        _id: true,
        amount: true,
        date: true,
        type: true,
        category: true,
      })

    when(() => !!sessionState.token, () => {
      operationSubscriptions.subscribe(async (operations) => {
        this.operations = operations as any[]
      })

      let prevYear : string|null = null

      reaction(() => [this.year, this.lastOperationDate], () => {
        this.months = [...Array(12).keys()]
          .map((month) => new StateMonth(month, this.year))
        this.weeks = [...Array(52).keys()]
          .map((week) => new StateWeek(week, this.year))

        if(prevYear !== this.year.toISOString()) {
          this.loadingDays = true
          this.loadingWeeks = true
          this.loadingMonths = true

          prevYear = this.year.toISOString()
        }

        this.days = [...Array(moment(this.lastOperationDate).dayOfYear()).keys()]
          .map((day) => new StateDay(moment(this.year).dayOfYear(day + 1)))

        Client.unsubscribe('Operation-updated', this.updateDays)
        Client.unsubscribe('Operation-updated', this.updateWeeks)
        Client.unsubscribe('Operation-updated', this.updateMonths)
        Client.subscribe('Operation-updated', this.updateDays)
        Client.subscribe('Operation-updated', this.updateWeeks)
        Client.subscribe('Operation-updated', this.updateMonths)

        this.updateDays()
        this.updateWeeks()
        this.updateMonths()

        operationSubscriptions
          .where({
            _operators: {
              date: {
                gte: moment(this.year).startOf('year').toISOString(),
                lte: moment(this.year).endOf('year').toISOString(),
              },
            },
          })
      }, { fireImmediately: true })
    })
  }

  @computed get lastOperationDate() {
    // Find last operation
    const lastOperation = this.operations.slice().sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
    return (lastOperation[0] || { date: this.year.toISOString() }).date
  }

  @observable loadingDays = false

  @action.bound updateDays() {
    const queries = this.days.map((day) => Client.builder
      .withName('operationDailyAnalysis')
      .withAlias(`operationDailyAnalysis${day.date.format('YYYYMMDD')}`)
      .withArgs({ day: day.date.toISOString() })
      .withSelection({
        yearlyCumulativeEarning: true,
        yearlyCumulativeSpending: true,
        yearlyCumulativeGain: true,
      }))

    Client.builder.combineQueries(queries)
      .then((daysValue) => {
        runInAction(() => {
          daysValue.forEach((value, i) => {
            this.days[i].value = value as DailyAnalysis
          })
          this.loadingDays = false
        })
      })
  }

  @observable loadingWeeks = false

  @action.bound updateWeeks() {
    const queries = this.weeks.map((week) => Client.builder
      .withName('operationWeeklyAnalysis')
      .withAlias(`operationWeeklyAnalysis${week.date.format('YYYYMMDD')}`)
      .withArgs({ week: week.date.toISOString() })
      .withSelection({
        totalEarned: true,
        totalSpent: true,
        gain: true,

        yearlyCumulativeEarning: true,
        yearlyCumulativeSpending: true,
        yearlyCumulativeGain: true,
      }))

    Client.builder.combineQueries(queries)
      .then((weeksValue) => {
        runInAction(() => {
          weeksValue.forEach((value, i) => {
            this.weeks[i].value = value as WeeklyAnalysis
          })
          this.loadingWeeks = false
        })
      })
  }

  @observable loadingMonths = false

  @action.bound updateMonths() {
    const queries = this.months.map((month) => Client.builder
      .withName('operationMonthlyAnalysis')
      .withAlias(`operationMonthlyAnalysis${month.date.format('YYYYMMDD')}`)
      .withArgs({ month: month.date.toISOString() })
      .withSelection({
        totalEarned: true,
        totalSpent: true,
        gain: true,

        monthlySpending: true,
        otherSpending: true,

        yearlyCumulativeEarning: true,
        yearlyCumulativeSpending: true,
        yearlyCumulativeGain: true,

        yearlyNecessaryRaise: {
          zero: true,
          goal: true,
        },

        categoryRepartition: {
          all: {
            category: {
              _id: true,
              name: true,
            },
            value: true,
          },
          monthly: {
            category: {
              _id: true,
              name: true,
            },
            value: true,
          },
          normal: {
            category: {
              _id: true,
              name: true,
            },
            value: true,
          },
          exceptional: {
            category: {
              _id: true,
              name: true,
            },
            value: true,
          },
        },
        typeRepartition: {
          monthly: true,
          normal: true,
          exceptional: true,
        },
      }))

    Client.builder.combineQueries(queries)
      .then((monthsValue) => {
        runInAction(() => {
          monthsValue.forEach((value, i) => {
            this.months[i].value = value as MonthlyAnalysis
          })
          this.loadingMonths = false
        })
      })
  }

  @computed get loading() {
    return this.loadingDays || this.loadingMonths || this.loadingWeeks
  }
}
