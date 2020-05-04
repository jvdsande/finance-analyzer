import {
  observable, action, computed, reaction,
} from 'mobx'

import { Nullable } from 'utils/types'

import { AccountAccessor, ConfigureClient, Client } from 'accessors'

type Administrator = { active: Nullable<boolean>, firstName: string, lastName: string, _id: string }

export default class StateSession {
    configuration = null

    constructor() {
      if (typeof window !== 'undefined') {
        this.updateToken(window.localStorage.getItem('token'))

        this.check()

        window.setInterval(this.check, 1000 * 60 * 60) // Check and renew token every hour
      }

      reaction(() => this.token, () => {
        if (this.token) {
          AccountAccessor.query
            .get
            .select({
              _id: true,
              active: true,
              firstName: true,
              lastName: true,
            })
            .then(async (admin) => {
              this.account = admin as Administrator
            })
        }
      })
    }

    @observable loading = true

    @observable token : Nullable<string> = null

    @observable account : Nullable<Administrator> = null

    @computed get connected() {
      return !!this.token
    }

    @action.bound async check() {
      const { token } = await Client.builder
        .withName('accountAuthenticated')
        .withSelection({
          token: true,
        })
        .asQuery()

      this.updateToken(token)
    }

    @action.bound updateToken(token : Nullable<string>) {
      if (token) {
        window.localStorage.setItem('token', token)
      } else {
        window.localStorage.removeItem('token')
      }

      ConfigureClient({ token })
      this.loading = false
      this.token = token
    }

    @action.bound async connect({ email, password } : { email: string, password: string }) {
      const { token, error } = await Client.builder
        .withName('accountLogin')
        .withArgs({
          email,
          password,
        })
        .withSelection({
          token: true,
          error: true,
        })
        .asQuery()

      if (error) {
        throw new Error(error)
      }

      this.updateToken(token)
    }

    @action.bound async activate(password : string) {
      const accountEditorSetup : string = await Client.builder
        .withName('accountSetup')
        .withArgs({ password })
        .asMutation() as any

      if (accountEditorSetup) {
        this.updateToken(accountEditorSetup)
      }
    }
}
