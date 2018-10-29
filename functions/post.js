const Redis = require('ioredis')
const ShortUniqueId = require('short-unique-id')
const logger = require('./logger')
const { redis, expire, uidLength } = require('./config')

const client = new Redis(redis)

const shortenUrl = async body => {
  const uid = new ShortUniqueId()
  const reply = await client.get('uid:length')
  const id = body.custom || uid.randomUUID(reply || uidLength)
  const exist = await client.exists(id)
  if (exist) return null
  await client.set(id, body.uri)
  await client.expire(id, expire)
  return id
}

exports.handler = function (event, context, callback) {
  shortenUrl(JSON.parse(event.body))
    .then(id => {
      if (id === null) {
        callback(null, { statusCode: 409 })
      } else {
        callback(null, { statusCode: 201, body: id })
      }
    })
    .catch(err => {
      logger.error(err, { extra: { body: event.body } })
      callback(null, { statusCode: 400, body: err.message })
    })
}
