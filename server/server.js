/* @flow */

import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import winston from 'winston'
import expressWinston from 'express-winston'

const SERVER_NOT_RUNNING = '*** Server not running'
const SERVER_SHUTTING_DOWN  = '*** Server shutting down'

const PUBLIC_ASSETS = path.join(__dirname, '../client/public')

async function create(config): Promise<Server> {
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

  server: hServer = app.listen(port)
  winston.info(`Server listening in port ${port}`)
  return server
}

function stop(server: Server): void {
  if (!server) {
    throw new Error(SERVER_NOT_RUNNING)
  }

  winston.info(SERVER_SHUTTING_DOWN)

  return server.close()
}

export default {
  create,
  stop,
  getServer
}
