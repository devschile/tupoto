'use strict'

const { createLogger, transports } = require('winston')
const Sentry = require('winston-sentry-raven-transport')
const { sentry } = require('./config')

module.exports = createLogger({
  transports: [new transports.Console({ timestamp: true }), new Sentry(sentry)]
})
