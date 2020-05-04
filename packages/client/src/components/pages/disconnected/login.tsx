import React from 'react'
import { observer } from 'mobx-react'
import { Helmet } from 'react-helmet'

import { classNames } from 'utils/react'

import state from 'state'

import { useTranslate, useLocalStore } from 'hooks'

import './login.scss'

const block = 'page-login'
const cx = classNames(block)

const PageLogin = () => {
  const Strings = useTranslate('pages.disconnected.login')

  const form = useLocalStore(() => ({
    email: '',
    password: '',
    error: '',
    setEmail(e: React.ChangeEvent<HTMLInputElement>) {
      form.email = e.target.value
    },
    setPassword(e: React.ChangeEvent<HTMLInputElement>) {
      form.password = e.target.value
    },
    async submit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()

      try {
        await state.session.connect({
          email: form.email,
          password: form.password,
        })
      } catch (err) {
        form.error = err.message
      }
    },
  }))

  return (
    <div className={cx(block)}>
      <Helmet title="Log in" />
      <h1 className={cx('__title')}>
        {Strings.title}
      </h1>

      <h2 className={cx('__description')}>
        {Strings.description}
      </h2>

      <form className={cx('__form')} onSubmit={form.submit}>
        <input
          className={cx('__email', '__input')}
          type="text"
          placeholder={Strings.form.email.placeholder}
          value={form.email}
          onChange={form.setEmail}
        />
        <input
          className={cx('__password', '__input')}
          type="password"
          placeholder={Strings.form.password.placeholder}
          value={form.password}
          onChange={form.setPassword}
        />

        {
            form.error && (
            <p className={cx('__error')}>
              {Strings.errors[form.error]}
            </p>
            )
        }

        <button className={cx('__button', '__submit')} type="submit">
          {Strings.form.submit}
        </button>
      </form>
    </div>
  )
}

export default observer(PageLogin)
