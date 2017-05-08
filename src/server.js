'use strict'

const http = require('http')
const Rx = require('rx')
const shortid = require('shortid')
const dburi = require('config-dburi')
const Redis = require('ioredis')
const pkg = require('../package.json')

const redis = new Redis(dburi.redis())
const subject = new Rx.Subject()
const port = process.env.PORT || 3000
const welcome = process.env.WELCOME || pkg.description
const expire = process.env.EXPIRE || 60 * 24 * 60 * 60 // expire in 60 days

redis.on('error', err => subject.onNext({type: 'error', error: err}))

const setId = (id, uri) => {
  redis.set(id, uri)
  redis.expire(id, expire)
}

const shorten = (uri, custom) => {
  if (!custom) {
    const id = shortid.generate()
    setId(id, uri)
    return Promise.resolve(id)
  }
  return redis.exists(custom).then(exist => {
    if (exist) return null
    setId(custom, uri)
    return custom
  })
}

const getOriginalUri = uri => {
  const id = uri.substr(1)
  if (!shortid.isValid()) Promise.resolve(null)
  return redis.get(id)
}

const getResponseTime = (req, res, digits) => {
  if (!req._startAt || !res._startAt) {
    return
  }
  // calculate diff
  var ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6
  // return truncated value
  return ms.toFixed(digits === undefined ? 3 : digits)
}

const endRequest = (req, res, data) => {
  subject.onNext({type: 'info', data: `${req.method} ${req.url} ${res.statusCode} - ${getResponseTime(req, res)} ms`})
  if (data) return res.end(data)
  res.end()
}

const server = http.createServer((req, res) => {
  req._startAt = process.hrtime()
  res._startAt = process.hrtime()
  const raw = []
  req.on('data', chunk => {
    raw.push(chunk)
  }).on('end', () => {
    if (req.url === '/') {
      if (req.method === 'GET') {
        endRequest(req, res, welcome)
      } else if (req.method === 'POST') {
        try {
          const body = JSON.parse(Buffer.concat(raw).toString())
          shorten(body.uri, body.custom).then(id => {
            if (id === null) {
              res.statusCode = 409
              endRequest(req, res)
            } else {
              endRequest(req, res, `${req.headers.host}/${id}`)
            }
          })
        } catch (err) {
          subject.onNext({type: 'error', error: err})
          res.statusCode = 400
          endRequest(req, res)
        }
      }
    } else {
      getOriginalUri(req.url).then(uri => {
        if (uri === null) {
          res.statusCode = 404
          endRequest(req, res)
        } else {
          endRequest(req, res, uri)
        }
      }).catch(err => {
        subject.onNext({type: 'error', error: err})
        res.statusCode = 500
        endRequest(req, res)
      })
    }
  })
})

server.on('clientError', (err, socket) => {
  subject.onNext({type: 'error', error: err})
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(port, err => {
  if (err) {
    subject.onNext({type: 'error', error: err})
  } else {
    subject.onNext({type: 'ready', data: `Listen in port ${port}`})
  }
})

module.exports = subject
