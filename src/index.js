'use strict'

const server = require('./server')
const config = require('./config')

server.listen(config.port, () => {
  console.log(`Express app started on port ${config.port}`)
})
