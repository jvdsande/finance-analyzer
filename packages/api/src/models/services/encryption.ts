// @ts-ignore
import aes256 from 'aes256'
import Logger, { ILogger, LoggerConfig } from '@harmonyjs/logger'

class ServiceEncryptionClass {
  secret ?: string

  logger ?: ILogger

  configure(configuration : { secret: string, log: LoggerConfig }) {
    this.secret = configuration.secret

    this.logger = Logger({ name: 'ServiceEncryption', configuration: configuration.log })
    this.logger.info('Starting encryption service"')
  }

  encryptPassword({ password, salt } : { password: string, salt: string }) {
    return aes256.encrypt(this.secret, password + salt).toString()
  }

  comparePassword({ password, salt, encrypted } : { password: string, salt: string, encrypted: string }) {
    return aes256.decrypt(this.secret, encrypted) === (password + salt)
  }
}

const ServiceEncryption = new ServiceEncryptionClass()

export default ServiceEncryption
