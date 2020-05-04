import { stat } from '@pika/pack/dist-types/util/fs'
import { OperationAccessor } from 'accessors'
import moment from 'moment'
import React, { useEffect } from 'react'
import { reaction } from 'mobx'
import { observer } from 'mobx-react'
import Select from 'react-select'

import { classNames } from 'utils/react'

import state from 'state'

import { useLocalStore } from 'hooks'

import { FaGripVertical, FaChevronDown, FaChevronUp } from 'react-icons/fa'

import './operation.scss'


const block = 'operation'
const cx = classNames(block)

type Operation = {
  _id: string,
  amount: number
  category: string
  type: string
  date: string
}

const typeName : {[key: string]: string} = {
  income: 'Income',
  monthly: 'Monthly',
  normal: 'Normal',
  exceptional: 'Exceptional',
}

const Operation = ({
  amount, category, type, _id, date,
} : Operation) => {
  const operation = useLocalStore(({
    id, cat, typ, amo, dat,
  }) => ({
    amount: `${amo}`,
    category: { value: cat._id, label: cat.name },
    type: { value: typ, label: typeName[typ] },
    date: dat,

    setAmount(e : any) {
      operation.amount = `${e.target.value}`
      operation.submit()
    },
    setCategory(value : any, noSubmit : boolean = false) {
      operation.category = value

      if (!noSubmit) {
        operation.submit()
      }
    },
    setType(value : any) {
      operation.type = value
      operation.submit()
    },
    setDate(value : string) {
      operation.date = value
      operation.submit()
    },

    async submit() {
      await OperationAccessor.mutate
        .update
        .withRecord({
          _id: id,
          amount: Number(operation.amount),
          type: operation.type.value,
          category: operation.category.value ? operation.category.value : null,
          date: operation.date,
        })
    },
  }), {
    id: _id,
    cat: (state.categories.categories.find((c) => c._id === category) || {}),
    typ: type,
    amo: amount,
    dat: date,
  })

  useEffect(() => reaction(() => state.categories.categories, () => {
    const cat = (state.categories.categories.find((c) => c._id === category) || {})
    operation.setCategory({ label: cat.name, value: cat._id }, true)
  }, { fireImmediately: true }), [category])

  return (
    <div
      className={cx(block, { '--dragging': state.dragndrop.element === _id })}
      style={{ top: `${state.dragndrop.position.y + 10}px`, left: `${state.dragndrop.position.x + 10}px` }}
    >
      <div className={cx('__amount', `__amount--${type}`, '__amount--shadow')}>
        <span>{operation.amount}</span>€
      </div>
      <input className={cx('__amount', `__amount--${type}`)} value={operation.amount} onChange={operation.setAmount} />

      <Select
        className={cx('__category')}
        classNamePrefix={cx('__category')}
        options={state.categories.categories.map((c) => ({
          value: c._id,
          label: c.name,
        }))}
        value={operation.category}
        onChange={operation.setCategory as any}
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
      <div className={cx('__change-date')}>
        <button
          type="button"
          onClick={() => operation.setDate(moment(operation.date).add(1, 'day').toISOString())}
          className={cx('__new-date')}
        >
          <FaChevronUp />
        </button>
        <button
          type="button"
          onClick={() => operation.setDate(moment(operation.date).subtract(1, 'day').toISOString())}
          className={cx('__new-date')}
        >
          <FaChevronDown />
        </button>
      </div>
      <button type="button" onMouseDown={() => state.dragndrop.grab(_id)} className={cx('__grip')}>
        <FaGripVertical />
      </button>
    </div>
  )
}

export default observer(Operation)
