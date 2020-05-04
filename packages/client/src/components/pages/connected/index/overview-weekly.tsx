import React from 'react'
import { observer } from 'mobx-react'

import { classNames } from 'utils/react'
import { moment } from 'utils/misc'

import state from 'state'

import './overview-weekly.scss'


const block = 'overview-weekly'
const cx = classNames(block)

const OverviewWeekly = () => (
  <div className={cx(block)}>
    <div className={cx('__weeks')}>
      <div className={cx('__week', '__week--header')}>
        <div className={cx('__name')}>
          Week
        </div>
        <div className={cx('__income')}>
          Income
        </div>
        <div className={cx('__spending')}>
          Spending
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
      </div>
      {
        state.operations.weeks.map((week) => (
          <div className={cx('__week')}>
            <div className={cx('__name')}>
              {moment(week.date).format('DD/MM/YY')}
              {' - '}
              {moment(week.date).add(6, 'day').format('DD/MM/YY')}
            </div>
            <div className={cx('__income')}>
              {week.value?.totalEarned?.toFixed(2)}
            </div>
            <div className={cx('__spending')}>
              {week.value?.totalSpent?.toFixed(2)}
            </div>
            <div className={cx('__gain')}>
              {week.value?.gain?.toFixed(2)}
            </div>
            <div className={cx('__yearly-gain')}>
              {week.value?.yearlyCumulativeGain?.toFixed(2)}
            </div>
            <div className={cx('__yearly-income')}>
              {week.value?.yearlyCumulativeEarning?.toFixed(2)}
            </div>
            <div className={cx('__yearly-spending')}>
              {week.value?.yearlyCumulativeSpending?.toFixed(2)}
            </div>
          </div>
        ))
      }
    </div>
  </div>
)

export default observer(OverviewWeekly)
