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

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  try {
    const id = await shortenUrl(JSON.parse(event.body))
    if (id === null) {
      return { statusCode: 409 }
    } else {
      return { statusCode: 201, body: `${event.headers.referer}${id}` }
    }
  } catch (err) {
    logger.error(err, { extra: { body: event.body } })
    return { statusCode: 400, body: err.message }
  }
}
