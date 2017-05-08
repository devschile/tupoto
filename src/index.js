'use strict'

const server = require('./server')
const winston = require('winston')
const Raven = require('raven')
const pkg = require('../package.json')

const ravenOptions = {
  release: pkg.version,
  environment: process.env.NODE_ENV || 'development'
}
Raven.config(process.env.SENTRY_DSN, ravenOptions).install()

const logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({'timestamp': true})]
})

server.subscribe(
  data => {
    if (['ready', 'info'].includes(data.type)) {
      logger.info(data.data)
    } else if (data.type === 'error') {
      logger.error(data.error)
      Raven.captureException(data.error)
    }
  },
  err => {
    logger.error(err)
    Raven.captureException(err)
    process.exit(1)
  },
  () => logger.info('Finish')
)

process.on('uncaughtException', err => {
  logger.error(err)
  Raven.captureException(err)
  process.exit(1)
})
