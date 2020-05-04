import { Scopes } from '@harmonyjs/persistence'

export default <Scopes> {
  readMany: async ({ args, context }) => {
    const nextArgs = { ...args }

    const { account } = context.authentication.get() || {}

    if (!account) {
      throw new Error('You must be authenticated to list categories')
    }

    nextArgs.filter = {
      ...(args.filter || {}),
      account,
    }

    return nextArgs
  },

  create: async ({ args, context }) => {
    const nextArgs = { ...args }

    const { account } = context.authentication.get() || {}

    if (!account) {
      throw new Error('You must be authenticated to create categories')
    }
    nextArgs.record.account = account

    return nextArgs
  },
  update: async ({ args, context }) => {
    const nextArgs = { ...args }

    const { account } = context.authentication.get() || {}

    if (!account) {
      throw new Error('You must be authenticated to update categories')
    }
    nextArgs.record.account = account

    return nextArgs
  },
  delete: async ({ args, context }) => {
    const nextArgs = { ...args }

    const { account } = context.authentication.get() || {}

    if (!account) {
      throw new Error('You must be authenticated to delete categories')
    }

    return nextArgs
  },
}
