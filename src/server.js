'use strict'

const path = require('path')
const http = require('http')
const os = require('os')

const bodyParser = require('body-parser')
const compress = require('compression')
const express = require('express')
const morgan = require('morgan')
const Raven = require('raven')
const shortid = require('shortid')
const Redis = require('ioredis')

const config = require('./config')

const redis = new Redis(config.redis)

// Instancia de express
const app = express()
const server = http.Server(app)

process.on('uncaughtException', err => {
  console.log(err)
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
app.use(compress({
  filter: (req, res) => {
    return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
  },
  level: 9
}))

// Logger
app.use(morgan('combined'))

// Parser de peticiones POST
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Estaticos
app.use(express.static(path.join(__dirname, '..', '..', 'build')))

// Controladores
const index = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
}
const getOriginalUri = (req, res, next) => {
  redis.get(req.params.id).then(uri => {
    if (uri === null) return res.status(404)
    res.send(uri)
  }).catch(next)
}
const setId = (id, uri) => {
  redis.set(id, uri)
  redis.expire(id, config.expire)
}
const shortenUrl = body => {
  if (!body.custom) {
    const id = shortid.generate()
    setId(id, body.uri)
    return Promise.resolve(id)
  }
  return redis.exists(body.custom).then(exist => {
    if (exist) return null
    setId(body.custom, body.uri)
    return body.custom
  })
}
const shorten = (req, res, next) => {
  shortenUrl(req.body).then(id => {
    if (id === null) {
      res.status(409)
    } else {
      res.send(`${req.headers.host}/${id}`)
    }
  }).catch(next)
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
  console.error(err)
  res.status(500)
})
app.use((req, res) => {
  res.status(404)
})
app.use((req, res, next) => {
  redis.on('error', (err) => next(err))
})

module.exports = server
