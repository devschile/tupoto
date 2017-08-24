'use strict'

const path = require('path')
const http = require('http')
const os = require('os')

const bodyParser = require('body-parser')
const compress = require('compression')
const express = require('express')
const morgan = require('morgan')
const Raven = require('raven')
const ShortUniqueId = require('short-unique-id')
const Redis = require('ioredis')

const config = require('./config')
const logger = require('./logger')

const uid = new ShortUniqueId()
const redis = new Redis(config.redis)

// Instancia de express
const app = express()
const server = http.Server(app)

process.on('uncaughtException', err => {
  logger.error(err)
  Raven.captureException(err)
  process.exit(1)
})

// Cliente de sentry para notificar errores de produccion
const ravenOptions = {
  release: config.version,
  environment: process.env.NODE_ENV || 'development',
  server_name: process.env.HOSTNAME || os.hostname(),
  captureUnhandledRejections: true,
  autoBreadcrumbs: true
}
Raven.config(process.env.SENTRY_TOKEN, ravenOptions).install()
app.use(Raven.requestHandler())

// Compresion
app.use(
  compress({
    filter: (req, res) => {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 9
  })
)

// Logger
app.use(morgan('combined'))

// Parser de peticiones POST
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Estaticos
app.use(express.static(path.join(__dirname, '..', 'public')))

// Controladores
const index = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
}
const getOriginalUri = (req, res, next) => {
  redis
    .get(req.params.id)
    .then(uri => {
      if (uri === null) return res.status(404)
      res.redirect(uri)
    })
    .catch(next)
}
const setId = (id, uri) => {
  redis.set(id, uri)
  redis.expire(id, config.expire)
}
const shortenUrl = body => {
  return redis.get('uid:length').then(reply => {
    const length = reply || config.uidLength
    const id = body.custom || uid.randomUUID(length)
    return redis.exists(id).then(exist => {
      if (exist) return null
      setId(id, body.uri)
      return id
    })
  })
}
const shorten = (req, res, next) => {
  shortenUrl(req.body)
    .then(id => {
      if (id === null) {
        res.status(409)
      } else {
        res.send(`https://${req.headers.host}/${id}`)
      }
    })
    .catch(next)
}

// Rutas
const router = new express.Router()

router.get('/', index)
router.get('/:id', getOriginalUri)
router.post('/', shorten)

app.use('/', router)

// Error logger
app.use(Raven.errorHandler())
app.use((err, req, res, next) => {
  if (config.env === 'production') {
    Raven.captureException(err, {
      user: req.user,
      extra: {
        body: req.body,
        originalUrl: req.originalUrl
      }
    })
  }
  logger.error(err)
  res.status(500)
})
app.use((req, res) => {
  res.status(404)
})
app.use((req, res, next) => {
  redis.on('error', err => next(err))
})

module.exports = server
