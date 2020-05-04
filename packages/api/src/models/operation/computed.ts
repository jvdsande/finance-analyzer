import { Computed, Types, Scope } from '@harmonyjs/persistence'

import moment from 'moment-timezone'

const authenticatedScope : Scope = async ({ context }) => {
  if (context!.authentication.get() && context!.authentication.get().account) {
    return
  }

  throw new Error('You need to be authenticated to use this query')
}

moment.locale('fr')

export default <Computed> {
  queries: {
    operationMonthlyAnalysis: {
      args: {
        month: Types.Date,
      },
      type: {
        totalEarned: Types.Float,
        totalSpent: Types.Float,
        gain: Types.Float,
        monthlySpending: Types.Float,
        otherSpending: Types.Float,

        yearlyCumulativeEarning: Types.Float,
        yearlyCumulativeSpending: Types.Float,
        yearlyCumulativeGain: Types.Float,
        yearlyNecessaryRaise: {
          zero: Types.Float,
          goal: Types.Float,
        },

        categoryRepartition: {
          all: [{
            category: Types.Reference.of('category'),
            value: Types.Float,
          }],
          monthly: [{
            category: Types.Reference.of('category'),
            value: Types.Float,
          }],
          normal: [{
            category: Types.Reference.of('category'),
            value: Types.Float,
          }],
          exceptional: [{
            category: Types.Reference.of('category'),
            value: Types.Float,
          }],
        },
        typeRepartition: {
          monthly: Types.Float,
          normal: Types.Float,
          exceptional: Types.Float,
        },
      },
      async resolve({ args, resolvers: { Account, Operation, Category: CategoryResolver }, context }) {
        const upperBound = moment(args.month).tz('Europe/Paris').endOf('month')
        const lowerBound = moment(args.month).tz('Europe/Paris').startOf('year')
        const monthBound = moment(args.month).tz('Europe/Paris').startOf('month')

        const account : any = await Account.read({ filter: { _id: context.authentication.get().account } })
        const operations : any[] = await Operation.readMany({
          filter: {
            account: account._id,
            _operators: {
              date: {
                lte: upperBound.toISOString(),
                gte: lowerBound.toISOString(),
              },
            },
          },
        })
        const categories : any[] = await CategoryResolver.readMany({
          filter: {
            account: account._id,
          },
        })

        const result = {
          totalEarned: 0,
          totalSpent: 0,
          gain: 0,
          monthlySpending: 0,
          otherSpending: 0,
          yearlyCumulativeEarning: 0,
          yearlyCumulativeSpending: 0,
          yearlyCumulativeGain: 0,
          yearlyNecessaryRaise: {
            zero: 0,
            goal: 0,
          },

          categoryRepartition: {
            all: [...categories.map((category) => ({
              category,
              value: 0,
            })), { category: null, value: 0 }],
            monthly: [...categories.map((category) => ({
              category,
              value: 0,
            })), { category: null, value: 0 }],
            normal: [...categories.map((category) => ({
              category,
              value: 0,
            })), { category: null, value: 0 }],
            exceptional: [...categories.map((category) => ({
              category,
              value: 0,
            })), { category: null, value: 0 }],
          },
          typeRepartition: {
            all: 0,
            monthly: 0,
            normal: 0,
            exceptional: 0,
          },
        }

        operations.forEach((operation) => {
          const isMonthly = moment(operation.date).tz('Europe/Paris').isSameOrAfter(monthBound)

          // Add yearly cumulative value and monthly value
          if (operation.type === 'income') {
            result.yearlyCumulativeEarning += operation.amount
            result.yearlyCumulativeGain += operation.amount
            if (isMonthly) {
              result.totalEarned += operation.amount
              result.gain += operation.amount
            }
          } else {
            result.yearlyCumulativeSpending += operation.amount
            result.yearlyCumulativeGain -= operation.amount
            if (isMonthly) {
              result.totalSpent += operation.amount
              result.gain -= operation.amount

              if (operation.type === 'monthly') {
                result.monthlySpending += operation.amount
              } else {
                result.otherSpending += operation.amount
              }
            }
          }

          // Add category repartition
          if (isMonthly && operation.category && operation.type !== 'income') {
            const categoryIndex = categories.findIndex((c) => String(c._id) === String(operation.category))
            const index = categoryIndex > -1 ? categoryIndex : (result.categoryRepartition.all.length - 1)
            result.categoryRepartition.all[index].value += operation.amount
            result.categoryRepartition[operation.type as 'monthly'][index].value += operation.amount
          }

          // Add type repartition
          if (isMonthly && operation.type !== 'income') {
            result.typeRepartition[operation.type as 'monthly'] += operation.amount
          }
        })

        const spending = result.yearlyCumulativeSpending
        const earning = result.yearlyCumulativeEarning

        // Compute necessary raise for zero-equilibrium
        let goal = 0
        let goalEarning = spending / (1 - goal)

        result.yearlyNecessaryRaise.zero = Math.max(0, 100 - (earning / goalEarning) * 100)

        // Compute necessary raise for goal-equilibrium
        goal = account.goals?.saving || 0
        goalEarning = spending / (1 - goal)

        result.yearlyNecessaryRaise.goal = Math.max(0, 100 - (earning / goalEarning) * 100)

        return result
      },

      scopes: [authenticatedScope],
    },

    operationWeeklyAnalysis: {
      args: {
        week: Types.Date,
      },
      type: {
        totalEarned: Types.Float,
        totalSpent: Types.Float,
        gain: Types.Float,

        yearlyCumulativeEarning: Types.Float,
        yearlyCumulativeSpending: Types.Float,
        yearlyCumulativeGain: Types.Float,
      },
      async resolve({ args, resolvers: { Account, Operation }, context }) {
        const upperBound = moment(args.week).tz('Europe/Paris').endOf('week')
        const lowerBound = moment(args.week).tz('Europe/Paris').startOf('year')
        const weekBound = moment(args.week).tz('Europe/Paris').startOf('week')

        const account : any = await Account.read({ filter: { _id: context.authentication.get().account } })
        const operations : any[] = await Operation.readMany({
          filter: {
            account: account._id,
            _operators: {
              date: {
                lte: upperBound.toISOString(),
                gte: lowerBound.toISOString(),
              },
            },
          },
        })

        const result = {
          totalEarned: 0,
          totalSpent: 0,
          gain: 0,

          yearlyCumulativeEarning: 0,
          yearlyCumulativeSpending: 0,
          yearlyCumulativeGain: 0,
        }

        operations.forEach((operation) => {
          const isWeekly = moment(operation.date).tz('Europe/Paris').isSameOrAfter(weekBound)

          // Add yearly cumulative value and monthly value
          if (operation.type === 'income') {
            result.yearlyCumulativeEarning += operation.amount
            result.yearlyCumulativeGain += operation.amount
            if (isWeekly) {
              result.totalEarned += operation.amount
              result.gain += operation.amount
            }
          } else {
            result.yearlyCumulativeSpending += operation.amount
            result.yearlyCumulativeGain -= operation.amount
            if (isWeekly) {
              result.totalSpent += operation.amount
              result.gain -= operation.amount
            }
          }
        })

        return result
      },

      scopes: [authenticatedScope],
    },

    operationDailyAnalysis: {
      args: {
        day: Types.Date,
      },
      type: {
        yearlyCumulativeEarning: Types.Float,
        yearlyCumulativeSpending: Types.Float,
        yearlyCumulativeGain: Types.Float,
      },
      async resolve({ args, resolvers: { Account, Operation }, context }) {
        const upperBound = moment(args.day).tz('Europe/Paris').endOf('day')

        const account : any = await Account.read({ filter: { _id: context.authentication.get().account } })
        const operations : any[] = await Operation.readMany({
          filter: {
            account: account._id,
            _operators: {
              date: {
                lte: upperBound.toISOString(),
              },
            },
          },
        })

        const result = {
          yearlyCumulativeEarning: 0,
          yearlyCumulativeSpending: 0,
          yearlyCumulativeGain: 0,
        }

        operations.forEach((operation) => {
          // Add yearly cumulative value and monthly value
          if (operation.type === 'income') {
            result.yearlyCumulativeEarning += operation.amount
            result.yearlyCumulativeGain += operation.amount
          } else {
            result.yearlyCumulativeSpending += operation.amount
            result.yearlyCumulativeGain -= operation.amount
          }
        })

        return result
      },

      scopes: [authenticatedScope],
    },
  },
}
