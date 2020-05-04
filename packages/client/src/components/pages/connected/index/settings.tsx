import { CategoryAccessor } from 'accessors'
import React from 'react'
import { observer } from 'mobx-react'

import { classNames } from 'utils/react'

import state from 'state'

import { useLocalStore } from 'hooks'

import { FaTrash } from 'react-icons/all'
import OutsideClickHandler from 'react-outside-click-handler'

import './settings.scss'


const block = 'settings'
const cx = classNames(block)

const Settings = () => {
  const newCategory = useLocalStore(() => ({
    value: '',

    onChange(e : any) {
      newCategory.value = e.target.value
    },
    submit(e : any) {
      e.preventDefault()
      CategoryAccessor.mutate
        .create
        .withRecord({
          name: newCategory.value,
        })
        .then(() => {
          newCategory.value = ''
        })
    },
  }))

  return (
    <div className={cx(block)}>
      <OutsideClickHandler onOutsideClick={() => {
        state.showSettings = false
      }}
      >
        <h1 className={cx('__title')}>
          Welcome, {[state.session.account?.firstName, state.session.account?.lastName].join(' ')}
        </h1>

        <h2 className={cx('__subtitle')}>
          Update categories
        </h2>

        <div className={cx('__categories')}>
          <form onSubmit={newCategory.submit}>
            <input
              placeholder="New category"
              type="text"
              className={cx('__new-category')}
              value={newCategory.value}
              onChange={newCategory.onChange}
            />
            <button type="submit" className={cx('__create-category')}>Create</button>
          </form>
          {
          state.categories.categories.map((category) => (
            <div className={cx('__category')}>
              {category.name}
              <button
                type="button"
                className={cx('__category-delete')}
                onClick={() => {
                  CategoryAccessor.mutate
                    .delete
                    .withId(category._id)
                    .then(() => null)
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))
        }
        </div>
      </OutsideClickHandler>
    </div>

  )
}

export default observer(Settings)
