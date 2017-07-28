'use strict'

const server = require('./server')
const config = require('./config')
const logger = require('./logger')

server.listen(config.port, () => {
  logger.info(`Express app started on port ${config.port}`) // eslint-disable-line
})
