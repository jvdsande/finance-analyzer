import { Computed, Types } from '@harmonyjs/persistence'

import ServiceEncryption from 'models/services/encryption'

export default <Computed> {

  queries: {
    accountLogin: {
      args: {
        email: Types.String,
        password: Types.String,
      },
      type: {
        error: Types.String,
        token: Types.String,
      },
      async resolve({ args, resolvers: { Account }, context: { authentication } }) {
        const user = await Account.get.unscoped({ filter: { email: args.email.toLowerCase().trim() } })

        if (user) {
          const passwordMatch = user.active ? ServiceEncryption.comparePassword({
            password: args.password,
            salt: user._id,
            encrypted: user.password,
          }) : (args.password === 'insane')

          if (passwordMatch) {
            return {
              token: authentication.create({ account: user._id, timestamp: new Date().valueOf() }),
            }
          }
          return {
            error: 'wrong_credentials',
          }
        }
        return {
          error: 'user_not_found',
        }
      },
    },

    accountAuthenticated: {
      type: {
        token: Types.String,
      },
      async resolve({ resolvers: { Account }, context: { authentication } }) {
        const auth = authentication.get()

        if (!auth) {
          return {
            token: null,
          }
        }

        const user = await Account.get.unscoped({ filter: { _id: auth.account } })

        if (user) {
          return {
            token: authentication.create({
              ...auth, account: user._id, timestamp: new Date().valueOf(),
            }),
          }
        }

        return {
          token: null,
        }
      },
    },
  },

  mutations: {
    accountSetup: {
      type: Types.String,
      args: {
        password: Types.String,
      },
      async resolve({ args, resolvers: { Account }, context: { authentication } }) {
        const auth = authentication.get()

        if (!auth) {
          return null
        }

        const user = await Account.get.unscoped({ filter: { _id: auth.account } })

        if (!user) {
          return null
        }

        const password = ServiceEncryption.encryptPassword({ password: args.password, salt: auth.account })
        await Account.update.unscoped({
          record: {
            _id: auth.account,
            password,
            active: true,
          },
        })

        return authentication.create({ ...auth, timestamp: new Date().valueOf() })
      },
    },
  },
}
