/* @flow */

import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import winston from 'winston'
import expressWinston from 'express-winston'
import { type ServerConfig } from './config/'
const SERVER_NOT_RUNNING = '*** Server not running'
const SERVER_SHUTTING_DOWN = '*** Server shutting down'

const PUBLIC_ASSETS = path.join(__dirname, '../client/public')

async function create(config: ServerConfig): Promise<express.Server> {
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
        filename: config.logFile,
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

  const server = app.listen(port)
  winston.info(`* Server listening in port ${port}`)
  return server
}

function destroy(server: express.Server): void {
  if (!server) {
    throw new Error(SERVER_NOT_RUNNING)
  }

  winston.info(SERVER_SHUTTING_DOWN)

  return server.close()
}

export default {
  create,
  destroy
}
