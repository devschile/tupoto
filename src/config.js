'use strict'

const path = require('path')
const dotenv = require('dotenv')
const dburi = require('config-dburi')
const pkg = require('../package.json')

dotenv.config({silent: true, path: path.join(__dirname, '..', '.env')})

module.exports = {
  env: process.env.NODE_ENV || 'development',
  redis: dburi.redis(),
  port: process.env.PORT || 3000,
  expire: process.env.EXPIRE || 60 * 24 * 60 * 60, // expire in 60 days
  version: pkg.version,
  uidLength: process.env.UID_LENGTH || 4
}
