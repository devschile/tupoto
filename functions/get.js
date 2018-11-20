const Redis = require('ioredis')
const logger = require('./utils/logger')
const { redis } = require('./utils/config')

const client = new Redis(redis)

exports.handler = async event => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  try {
    const uri = await client.get(event.queryStringParameters.id)
    if (uri === null) return { statusCode: 404 }
    return { statusCode: 200, body: uri }
  } catch (err) {
    logger.error(err, { extra: { body: event.body } })
    return { statusCode: 400, body: err.message }
  }
}
