import { OperationAccessor } from 'accessors'
import moment from 'moment'
import React, { useEffect } from 'react'
import { observer, useLocalStore } from 'mobx-react'

import { classNames } from 'utils/react'

import state from 'state'

import Select from 'react-select'
import { FaPlus, FaChevronDown, FaTimes } from 'react-icons/fa'

import './new-operation.scss'


const block = 'new-operation'
const cx = classNames(block)

type Operation = {
  amount: number
  category: string
  type: string
}

const NewOperation = () => {
  const operation = useLocalStore(() => ({
    amount: '',
    category: { value: null, label: '' },
    type: { value: 'normal', label: 'Normal' },
    date: moment().startOf('day').format('YYYY-MM-DD'),

    showDate: false,

    setAmount(e : any) {
      operation.amount = e.target.value
    },
    setCategory(value : any) {
      operation.category = value
    },
    setType(value : any) {
      operation.type = value
    },
    setDate(event : any) {
      operation.date = event.target.value
    },

    toggleShowDate() {
      operation.showDate = !operation.showDate
    },

    async submit(e : any) {
      e.preventDefault()

      if (!Number(operation.amount)) {
        return
      }

      await OperationAccessor.mutate
        .create
        .withRecord({
          amount: Number(operation.amount),
          type: operation.type.value,
          category: operation.category.value,
          date: moment(operation.date).toISOString(),
        })

      operation.amount = ''
    },
  }))

  useEffect(() => {
    state.dragndrop.onDate = (date) => {
      operation.setDate({
        target: {
          value: moment(date).format('YYYY-MM-DD'),
        },
      })
    }
  }, [])

  return (
    <form onSubmit={operation.submit} className={cx(block)}>
      <div className={cx('__container')}>
        <input
          type="number"
          className={cx('__amount')}
          value={operation.amount}
          onChange={operation.setAmount}
        />

        <Select
          className={cx('__category')}
          classNamePrefix={cx('__category')}
          options={[
            { value: null, label: '' },
            ...state.categories.categories.map((c) => ({
              value: c._id,
              label: c.name,
            }))]}
          value={operation.category}
          onChange={operation.setCategory}
        />
        <Select
          className={cx('__type')}
          classNamePrefix={cx('__type')}
          options={[
            { value: 'income', label: 'Income' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'normal', label: 'Normal' },
            { value: 'exceptional', label: 'Exceptional' },
          ]}
          value={operation.type}
          onChange={operation.setType}
        />

        <button type="submit" className={cx('__add')}>
          <FaPlus className={cx('__add-icon')} />
        </button>
        <button type="button" className={cx('__date')} onClick={operation.toggleShowDate}>
          {
            operation.showDate ? (
              <FaTimes className={cx('__date-icon')} />
            ) : (
              <FaChevronDown className={cx('__date-icon')} />
            )
          }
        </button>
      </div>

      <div className={cx('__insert-date', { '__insert-date--open': operation.showDate })}>
        <input type="date" value={operation.date} onChange={operation.setDate} />
      </div>
    </form>
  )
}

export default observer(NewOperation)
