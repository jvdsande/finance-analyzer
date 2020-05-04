import Server from '@harmonyjs/server'
import Persistence from '@harmonyjs/persistence'

import AdapterMongoose from '@harmonyjs/adapter-mongoose'

import ControllerAuthenticationJWT from '@harmonyjs/controller-auth-jwt'

import ServiceEncryption from 'models/services/encryption'

import models from 'models'

async function run() {
  const server = Server()
  const persistence = Persistence()

  ServiceEncryption.configure({
    secret: 'finance',
    log: {},
  })

  await persistence.initialize({
    strict: true,

    models,
    adapters: {
      mongo: AdapterMongoose({
        host: 'mongodb://localhost:27017',
        database: 'finance-analyzer',
      }),
    },
  })

  await server.initialize({
    endpoint: {
      host: '0.0.0.0',
      port: 4000,
    },
    controllers: [
      ControllerAuthenticationJWT({
        secret: 'finance-secret',
      }),
      persistence.controllers.ControllerGraphQL({
        enablePlayground: true,
        path: '/',
        authentication: ControllerAuthenticationJWT,
      }),
      persistence.controllers.ControllerEvents(),
    ],
  })
}

run()
  .catch((err) => {
    console.error('Fatal error: ', err)
  })
