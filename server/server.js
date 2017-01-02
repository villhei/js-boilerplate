/* @flow */

import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import winston from 'winston'
import expressWinston from 'express-winston'

let server = null
const PUBLIC_ASSETS = path.join(__dirname, '../client/public')

async function start(config): Promise<any> {
  if (server) {
    throw new Error('Urapalvelu server already running')
  }

  const app = express()
  app.use(bodyParser.json())

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        level: config.logLevel,
        json: false,
        colorize: true
      }),
      new (winston.transports.File)({
        filename: 'dev-log.log',
        level: config.logLevel
      })
    ],
    expressFormat: true,
    colorize: true,
    meta: false,
    msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}'
  }))

  app.use(express.static(PUBLIC_ASSETS))


  const port: number = 3000

  server = app.listen(port)
  winston.info(`Server listening in port ${port}`)
}

function stop(): void {
  if (!server) {
    throw new Error('Server not running')
  }

  winston.info('Shutting down server')

  server.close()
  server = null
}

function getServer() {
  return server
}

export default {
  start,
  stop,
  getServer
}
