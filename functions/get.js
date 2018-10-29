const Redis = require('ioredis')
const logger = require('./logger')
const { redis } = require('./config')

const client = new Redis(redis)

exports.handler = function (event, context, callback) {
  client
    .get(event.body)
    .then(uri => {
      if (uri === null) return callback(null, { statusCode: 404 })
      callback(null, { statusCode: 200, body: uri })
    })
    .catch(err => {
      logger.error(err, { extra: { body: event.body } })
      callback(null, { statusCode: 400, body: err.message })
    })
}
