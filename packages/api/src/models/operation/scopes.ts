import { Scopes } from '@harmonyjs/persistence'

export default <Scopes> {
  readMany: async ({ args, context }) => {
    const nextArgs = { ...args }

    const { account } = context.authentication.get() || {}

    if (!account) {
      throw new Error('You must be authenticated to list operations')
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
      throw new Error('You must be authenticated to create operations')
    }
    nextArgs.record.account = account

    if (args.record && args.record.amount && args.record.amount < 0) {
      nextArgs.record.amount = -args.record.amount
    }

    return nextArgs
  },
  update: async ({ args, context }) => {
    const nextArgs = { ...args }

    const { account } = context.authentication.get() || {}

    if (!account) {
      throw new Error('You must be authenticated to update operations')
    }
    nextArgs.record.account = account

    if (args.record && args.record.amount && args.record.amount < 0) {
      nextArgs.record.amount = -args.record.amount
    }

    return nextArgs
  },
  delete: async ({ args, context }) => {
    const nextArgs = { ...args }

    const { account } = context.authentication.get() || {}

    if (!account) {
      throw new Error('You must be authenticated to delete operations')
    }

    return nextArgs
  },
}
