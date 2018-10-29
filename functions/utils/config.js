'use strict'

const dburi = require('config-dburi')
const pkg = require('../../package.json')

module.exports = {
  redis: dburi.redis(),
  expire: process.env.EXPIRE || 60 * 24 * 60 * 60, // expire in 60 days
  version: pkg.version,
  uidLength: process.env.UID_LENGTH || 4,
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      release: pkg.version
    }
  }
}
