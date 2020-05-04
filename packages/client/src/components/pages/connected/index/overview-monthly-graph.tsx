import { ResponsiveLine } from '@nivo/line'
import React from 'react'
import { observer } from 'mobx-react'

import { classNames } from 'utils/react'
import { moment } from 'utils/misc'

import state from 'state'

import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/all'
import { ResponsivePie } from '@nivo/pie'

import './overview-monthly-graph.scss'


const block = 'overview-monthly-graph'
const cx = classNames(block)

const defaultCategoryColors = [
  'rgb(179, 214, 237)',
  'rgb(77, 160, 212)',
  'rgb(0, 119, 194)',
  'rgb(0, 100, 180)',
  'rgb(0, 71, 159)',
]

const OverviewMonthlyGraph = () => {
  const month = state.operations.months.find((m) => m.date.isSame(state.overview, 'month'))

  return (
    <div className={cx(block)}>
      <button
        type="button"
        className={cx('__close')}
        onClick={() => {
          state.overview = 'monthly'
        }}
      >
        <FaTimes />
      </button>

      <h1 className={cx('__title')}>
        <button
          className={cx('__month-button')}
          type="button"
          onClick={() => {
            state.overview = moment(state.overview).subtract(1, 'month').toISOString()
          }}
        >
          <FaChevronLeft />
        </button>
        {moment(state.overview).format('MMMM YYYY')}
        <button
          className={cx('__month-button')}
          type="button"
          onClick={() => {
            state.overview = moment(state.overview).add(1, 'month').toISOString()
          }}
        >
          <FaChevronRight />
        </button>
      </h1>

      <div className={cx('__content')}>
        <div className={cx('__pie-container', '__pie-container--main')}>
          <h2 className={cx('__pie-title')}>Type repartition</h2>
          <div className={cx('__pie-wrapper', '__pie-wrapper--main')}>
            <ResponsivePie
              data={
                [
                  {
                    id: 'monthly',
                    label: 'Monthly',
                    color: defaultCategoryColors[4],
                    value: month?.value?.typeRepartition.monthly || 0,
                  },
                  {
                    id: 'normal',
                    label: 'Normal',
                    color: defaultCategoryColors[2],
                    value: month?.value?.typeRepartition.normal || 0,
                  },
                  {
                    id: 'exceptional',
                    label: 'Exceptional',
                    color: defaultCategoryColors[0],
                    value: month?.value?.typeRepartition.exceptional || 0,
                  },
                ]
              }
              colors={(data) => data.color as string}
              margin={{
                top: 40, right: 80, bottom: 80, left: 80,
              }}
              enableSlicesLabels={false}
              enableRadialLabels={false}
              animate
              motionStiffness={90}
              motionDamping={15}
              theme={{
                tooltip: {
                  container: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  },
                },
              }}
              tooltip={(props) => (
                <div className={cx('__tooltip')}>
                  {/* eslint-disable-next-line react/prop-types */}
                  {props.label} : <b>{Number(props.value).toFixed(2)}€</b>
                </div>
              )}
              padAngle={2}
              innerRadius={0.1}
              cornerRadius={5}
            />
          </div>
        </div>

        <div className={cx('__pie-container', '__pie-container--main')}>
          <h2 className={cx('__pie-title')}>Category repartition</h2>
          <div className={cx('__pie-wrapper', '__pie-wrapper--main')}>
            <ResponsivePie
              data={
                month?.value?.categoryRepartition.all
                  .map((entry, i) => ({
                    id: i,
                    label: (entry.category && entry.category.name) || 'Uncategorized',
                    value: entry.value,
                  }))
                  .filter((e) => e.value)
                || []
              }
              colors={(data) => (
                data.color || defaultCategoryColors[Number(data.id) % defaultCategoryColors.length]
              ) as string}
              margin={{
                top: 40, right: 80, bottom: 80, left: 80,
              }}
              enableSlicesLabels={false}
              enableRadialLabels={false}
              animate
              motionStiffness={90}
              motionDamping={15}
              theme={{
                tooltip: {
                  container: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  },
                },
              }}
              tooltip={(props) => (
                <div className={cx('__tooltip')}>
                  {/* eslint-disable-next-line react/prop-types */}
                  {props.label} : <b>{Number(props.value).toFixed(2)}€</b>
                </div>
              )}
              padAngle={2}
              innerRadius={0.1}
              cornerRadius={5}
            />
          </div>
        </div>
        <div className={cx('__pie-container')}>
          <h2 className={cx('__pie-title')}>Category repartition (normal)</h2>
          <div className={cx('__pie-wrapper')}>
            <ResponsivePie
              data={
                month?.value?.categoryRepartition.normal
                  .map((entry, i) => ({
                    id: i,
                    label: (entry.category && entry.category.name) || 'Uncategorized',
                    value: entry.value,
                  }))
                  .filter((e) => e.value) || []
              }
              colors={(data) => (
                data.color || defaultCategoryColors[Number(data.id) % defaultCategoryColors.length]
              ) as string}
              margin={{
                top: 40, right: 80, bottom: 80, left: 80,
              }}
              enableSlicesLabels={false}
              enableRadialLabels={false}
              animate
              motionStiffness={90}
              motionDamping={15}
              theme={{
                tooltip: {
                  container: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  },
                },
              }}
              tooltip={(props) => (
                <div className={cx('__tooltip')}>
                  {/* eslint-disable-next-line react/prop-types */}
                  {props.label} : <b>{Number(props.value).toFixed(2)}€</b>
                </div>
              )}
              padAngle={2}
              innerRadius={0.1}
              cornerRadius={5}
            />
          </div>
        </div>

        <div className={cx('__pie-container')}>
          <h2 className={cx('__pie-title')}>Category repartition (monthly)</h2>
          <div className={cx('__pie-wrapper')}>
            <ResponsivePie
              data={
                month?.value?.categoryRepartition.monthly
                  .map((entry, i) => ({
                    id: i,
                    label: (entry.category && entry.category.name) || 'Uncategorized',
                    value: entry.value,
                  }))
                  .filter((e) => e.value) || []
              }
              colors={(data) => (
                data.color || defaultCategoryColors[Number(data.id) % defaultCategoryColors.length]
              ) as string}
              margin={{
                top: 40, right: 80, bottom: 80, left: 80,
              }}
              enableSlicesLabels={false}
              enableRadialLabels={false}
              animate
              motionStiffness={90}
              motionDamping={15}
              theme={{
                tooltip: {
                  container: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  },
                },
              }}
              tooltip={(props) => (
                <div className={cx('__tooltip')}>
                  {/* eslint-disable-next-line react/prop-types */}
                  {props.label} : <b>{Number(props.value).toFixed(2)}€</b>
                </div>
              )}
              padAngle={2}
              innerRadius={0.1}
              cornerRadius={5}
            />
          </div>
        </div>

        <div className={cx('__pie-container')}>
          <h2 className={cx('__pie-title')}>Category repartition (exceptional)</h2>
          <div className={cx('__pie-wrapper')}>
            <ResponsivePie
              data={
                month?.value?.categoryRepartition.exceptional
                  .map((entry, i) => ({
                    id: i,
                    label: (entry.category && entry.category.name) || 'Uncategorized',
                    value: entry.value,
                  }))
                  .filter((e) => e.value) || []
              }
              colors={(data) => (
                data.color || defaultCategoryColors[Number(data.id) % defaultCategoryColors.length]
              ) as string}
              margin={{
                top: 40, right: 80, bottom: 80, left: 80,
              }}
              enableSlicesLabels={false}
              enableRadialLabels={false}
              animate
              motionStiffness={90}
              motionDamping={15}
              theme={{
                tooltip: {
                  container: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                  },
                },
              }}
              tooltip={(props) => (
                <div className={cx('__tooltip')}>
                  {/* eslint-disable-next-line react/prop-types */}
                  {props.label} : <b>{Number(props.value).toFixed(2)}€</b>
                </div>
              )}
              padAngle={2}
              innerRadius={0.1}
              cornerRadius={5}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(OverviewMonthlyGraph)
