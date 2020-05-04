import { Scopes } from '@harmonyjs/persistence'

export default <Scopes> {
  async read({ args, context }) {
    const auth = context.authentication.get()

    if (!auth) {
      throw new Error('You must be authenticated to fetch an account')
    }

    const nextArgs = { ...args }

    nextArgs.filter = args.filter || {}
    nextArgs.filter._id = auth.account

    return nextArgs
  },
  async readMany({ args, context }) {
    const auth = context.authentication.get()

    if (!auth) {
      throw new Error('You must be authenticated to fetch an account')
    }

    return args
  },
  async update({ args, context }) {
    const auth = context.authentication.get()

    if (!auth) {
      throw new Error('You must be authenticated to update an account')
    }

    return args
  },
  async create({ args, context }) {
    const auth = context.authentication.get()

    if (!auth) {
      throw new Error('You must be authenticated to update an account')
    }

    return args
  },
  async delete({ args, context }) {
    const auth = context.authentication.get()

    if (!auth) {
      throw new Error('You must be authenticated to update an account')
    }

    return args
  },
}
