import Client, { Accessor } from '@harmonyjs/query'

import Configuration from 'configuration'

export const AccountAccessor = Accessor('account')
export const OperationAccessor = Accessor('operation')
export const CategoryAccessor = Accessor('category')

export function ConfigureClient({ token } : { token: string|null }) {
  return Client.configure({
    graphql: {
      host: Configuration.api || 'https://api-finance.jvdsande.com',
      path: '/',
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    socket: {
      host: Configuration.api || 'https://api-finance.jvdsande.com',
    },
  })
}

export { default as Client } from '@harmonyjs/query'
