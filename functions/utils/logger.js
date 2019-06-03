'use strict'

const { createLogger, transports } = require('winston')
const SentryTransport = require('winston-sentry-node')
const { sentry } = require('./config')

const customTransports = [new transports.Console({ timestamp: true })]
if (process.env.SENTRY_DSN) {
  customTransports.push(new SentryTransport({ sentry }))
}

module.exports = createLogger({ transports: customTransports })
