import React from 'react'
import { observer } from 'mobx-react'
import { Helmet } from 'react-helmet'

import {
  FaChevronLeft, FaChevronRight, FaCircleNotch, FaPowerOff, FaCog,
} from 'react-icons/all'

import { classNames } from 'utils/react'
import { moment } from 'utils/misc'

import state from 'state'

import { ResponsiveLine } from '@nivo/line'

import Operation from 'components/pages/connected/index/operation'
import NewOperation from 'components/pages/connected/index/new-operation'
import OverviewMonthly from 'components/pages/connected/index/overview-monthly'
import OverviewMonthlyGraph from 'components/pages/connected/index/overview-monthly-graph'
import OverviewWeekly from 'components/pages/connected/index/overview-weekly'
import Settings from 'components/pages/connected/index/settings'

import './index.scss'


const block = 'page-index'
const cx = classNames(block)

const PageIndex = () => {
  const operations = state.operations.operations
    .slice()
    .sort((a, b) => {
      if (moment(a.date).isAfter(b.date, 'day')) {
        return -1
      }

      if (moment(a.date).isBefore(b.date, 'day')) {
        return 1
      }

      if (Number.parseInt(a._id, 16) > Number.parseInt(b._id, 16)) {
        return -1
      }

      if (Number.parseInt(a._id, 16) < Number.parseInt(b._id, 16)) {
        return 1
      }

      return 0
    })

  const firstDate = state.operations.operations
    .slice()
    .reduce(
      (date, op) => (date.isAfter(moment(op.date).startOf('day'))
        ? moment(op.date).startOf('day')
        : date),
      moment().startOf('day'),
    )

  const dates : any[] = []

  if (state.dragndrop.element) {
    let date = firstDate.valueOf()
    const now = moment().startOf('day').valueOf()

    while (date < now) {
      dates.unshift(moment(date))
      date += 24 * 60 * 60 * 1000
    }
  }

  return (
    <div className={cx(block)}>
      <Helmet title="Analyzer" />
      <div className={cx('__operation-panel')}>
        <button
          type="button"
          className={cx('__logout')}
          onClick={() => {
            state.session.updateToken(null)
          }}
        >
          <FaPowerOff />
        </button>
        <button
          type="button"
          className={cx('__settings')}
          onClick={() => {
            state.showSettings = true
          }}
        >
          <FaCog />
        </button>

        <div className={cx('__select-year')}>
          <button
            className={cx('__year-button')}
            type="button"
            onClick={() => {
              state.operations.year = moment(state.operations.year).subtract(1, 'year')
            }}
          >
            <FaChevronLeft />
          </button>
          {state.operations.year.format('YYYY')}
          <button
            className={cx('__year-button')}
            type="button"
            onClick={() => {
              state.operations.year = moment(state.operations.year).add(1, 'year')
            }}
          >
            <FaChevronRight />
          </button>
        </div>

        <NewOperation />

        {
          state.dragndrop.element && (
            <Operation
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(state.operations.operations.find((o) => o._id === state.dragndrop.element) || {})}
            />
          )
        }

        <div className={cx('__operations')}>
          {
            state.dragndrop.element
              ? dates.map((date, i) => {
                // Check if previous date does not exists or is in another month
                const prevDate = i > 0 ? dates[i - 1] : null
                const isSameMonth = !!prevDate && prevDate.isSame(date, 'month')

                if (!isSameMonth) {
                  return (
                    <React.Fragment key={date.toISOString()}>
                      <div
                        className={cx('__month', '__month--no-sticky')}
                        onMouseEnter={() => state.dragndrop.onTargetEnter(
                          `${moment(date).startOf('day').toISOString()}--month`,
                        )}
                        onMouseLeave={() => state.dragndrop.onTargetLeave(
                          `${moment(date).startOf('day').toISOString()}--month`,
                        )}
                      >
                        {moment(date).format('MMMM YYYY')}
                      </div>
                      <div
                        className={cx('__day', '__day--no-sticky')}
                        onMouseEnter={() => state.dragndrop.onTargetEnter(
                          `${moment(date).startOf('day').toISOString()}--day`,
                        )}
                        onMouseLeave={() => state.dragndrop.onTargetLeave(
                          `${moment(date).startOf('month').toISOString()}--day`,
                        )}
                      >
                        {moment(date).format('DD/MM/YYYY')}
                      </div>
                    </React.Fragment>
                  )
                }

                return (
                  <div
                    key={date.toISOString()}
                    className={cx('__day', '__day--no-sticky')}
                    onMouseEnter={() => state.dragndrop.onTargetEnter(
                      `${moment(date).startOf('day').toISOString()}--day`,
                    )}
                    onMouseLeave={() => state.dragndrop.onTargetLeave(
                      `${moment(date).startOf('month').toISOString()}--day`,
                    )}
                  >
                    {moment(date).format('DD/MM/YYYY')}
                  </div>
                )
              })
              : operations.map((op, i, ops) => {
                // Check if previous op does not exists or is in another day/month
                const prevOp = i > 0 ? ops[i - 1] : null
                const isSameDay = !!prevOp && moment(prevOp.date).isSame(op.date, 'day')
                const isSameMonth = !!prevOp && moment(prevOp.date).isSame(op.date, 'month')

                if (!isSameMonth) {
                  return (
                    <React.Fragment key={op._id}>
                      <div className={cx('__month')}>
                        {moment(op.date).format('MMMM YYYY')}
                      </div>
                      <div className={cx('__day', '__day--no-border')}>
                        {moment(op.date).format('DD/MM/YYYY')}
                      </div>
                      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                      <Operation {...op} />
                    </React.Fragment>
                  )
                }

                if (!isSameDay) {
                  return (
                    <React.Fragment key={op._id}>
                      <div className={cx('__day')}>
                        {moment(op.date).format('DD/MM/YYYY')}
                      </div>
                      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                      <Operation {...op} />
                    </React.Fragment>
                  )
                }

                return (
                // eslint-disable-next-line react/jsx-props-no-spreading
                  <Operation key={op._id} {...op} />
                )
              })
          }
        </div>
      </div>

      <div className={cx('__overview-panel')}>
        <div className={cx('__overview-daily')}>
          <ResponsiveLine
            data={[{
              id: 'daily',
              data: state.operations.days
                .slice()
                .map((d) => ({
                  x: d.date.format('YYYY-MM-DD'),
                  y: d.value?.yearlyCumulativeGain ?? 0,
                })),
            }]}
            margin={{
              top: 20, right: 20, bottom: 20, left: 20,
            }}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              precision: 'day',
            }}
            xFormat={(v) => moment(v).format('DD MMMM YYYY')}
            sliceTooltip={(props) => (
              <div className={cx('__tooltip')}>
                {/* eslint-disable-next-line react/prop-types */}
                {props.slice.points[0].data.xFormatted} : <b>{props.slice.points[0].data.yFormatted}</b>
              </div>
            )}
            yFormat={(v) => `${Number(v).toFixed(2)}€`}
            colors="rgb(0, 100, 180)"
            curve="natural"
            axisBottom={null}
            axisLeft={null}
            enableArea
            enableSlices="x"
            enablePoints={false}
            enableGridX={false}
            enableGridY={false}
            crosshairType="x"
          />
        </div>
        {
          ['monthly', 'weekly'].includes(state.overview) ? (
            <div className={cx('__overview-monthly-weekly')}>
              <div className={cx('__overview-switcher')}>
                <button
                  type="button"
                  className={cx('__overview-kind', { '__overview-kind--active': state.overview === 'monthly' })}
                  onClick={() => { state.overview = 'monthly' }}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={cx('__overview-kind', { '__overview-kind--active': state.overview === 'weekly' })}
                  onClick={() => { state.overview = 'weekly' }}
                >
                  Weekly
                </button>
              </div>

              {
                state.overview === 'monthly' ? (
                  <OverviewMonthly />
                ) : (
                  <OverviewWeekly />
                )
              }
            </div>
          ) : (
            <div className={cx('__overview-monthly-weekly')}>
              <OverviewMonthlyGraph />
            </div>
          )
        }

      </div>

      {
        state.operations.loading && (
          <div className={cx('__loading')}>
            <FaCircleNotch className={cx('__loading-icon')} />
          </div>
        )
      }

      {
        state.showSettings && (
          <div className={cx('__loading')}>
            <Settings />
          </div>
        )
      }
    </div>
  )
}

export default observer(PageIndex)
