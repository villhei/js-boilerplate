/* @flow */

export type ServerConfig = {
  logLevel: 'debug',
  logFile: string

}
const serverConfig: ServerConfig = {
  logLevel: 'debug',
  logFile: 'dev-log.log'
}

export default serverConfig
