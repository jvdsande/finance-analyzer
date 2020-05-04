import React from 'react'
import { observer } from 'mobx-react'

import { classNames } from 'utils/react'
import { moment } from 'utils/misc'

import state from 'state'

import { FaChartLine } from 'react-icons/all'

import './overview-monthly.scss'


const block = 'overview-monthly'
const cx = classNames(block)

const OverviewMonthly = () => (
  <div className={cx(block)}>
    <div className={cx('__months')}>
      <div className={cx('__month', '__month--header')}>
        <div className={cx('__name')}>
          Month
        </div>
        <div className={cx('__income')}>
          Income
        </div>
        <div className={cx('__spending')}>
          Spending
        </div>
        <div className={cx('__monthly-spending')}>
          Monthly spending
        </div>
        <div className={cx('__variable-spending')}>
          Variable spending
        </div>
        <div className={cx('__gain')}>
          Gain
        </div>
        <div className={cx('__yearly-gain')}>
          Yearly gain
        </div>
        <div className={cx('__yearly-income')}>
          Yearly income
        </div>
        <div className={cx('__yearly-spending')}>
          Yearly spending
        </div>
        <div className={cx('__raise')}>
          Raise for balance
        </div>
        <div className={cx('__raise')}>
          Raise for goal
        </div>
        <div className={cx('__graph')} />
      </div>
      {
        state.operations.months.map((month) => (
          <div className={cx('__month')}>
            <div className={cx('__name')}>
              {moment(month.date).format('MMMM')}
            </div>
            <div className={cx('__income')}>
              {month.value?.totalEarned?.toFixed(2)}
            </div>
            <div className={cx('__spending')}>
              {month.value?.totalSpent?.toFixed(2)}
            </div>
            <div className={cx('__monthly-spending')}>
              {month.value?.monthlySpending?.toFixed(2)}
            </div>
            <div className={cx('__variable-spending')}>
              {month.value?.otherSpending?.toFixed(2)}
            </div>
            <div className={cx('__gain')}>
              {month.value?.gain?.toFixed(2)}
            </div>
            <div className={cx('__yearly-gain')}>
              {month.value?.yearlyCumulativeGain?.toFixed(2)}
            </div>
            <div className={cx('__yearly-income')}>
              {month.value?.yearlyCumulativeEarning?.toFixed(2)}
            </div>
            <div className={cx('__yearly-spending')}>
              {month.value?.yearlyCumulativeSpending?.toFixed(2)}
            </div>
            <div className={cx('__raise')}>
              {month.value?.yearlyNecessaryRaise.zero?.toFixed(1)}
            </div>
            <div className={cx('__raise')}>
              {month.value?.yearlyNecessaryRaise.goal?.toFixed(1)}
            </div>
            <button
              type="button"
              onClick={() => {
                state.overview = month.date.toISOString()
              }}
              className={cx('__graph')}
            >
              <FaChartLine />
            </button>
          </div>
        ))
      }
    </div>
  </div>
)

export default observer(OverviewMonthly)
