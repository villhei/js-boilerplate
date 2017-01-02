/* @flow */

import server from './server'
import config from './config'
import nock from 'nock'
import { refreshApiToken } from './auth'
import jwt from 'jsonwebtoken'

const ACCESS_TOKEN = 'some-access-token'

async function startServer() {
  mockGetJWTConfig()
  mockGetToken()
  await server.start(config)
}

async function stopServer() {
  await server.stop()
}

function mockGetJWTConfig() {
  nock(config.uraApi.apiUrl)
    .get('/auth/config')
    .reply(200, {
      audience: 'ura-api',
      issuer: 'auth0',
      algorithms: ['RS256']
    })
}


function mockGetToken() {
  nock(config.uraApi.apiUrl)
    .post('/client/token', {
      clientId: config.clientId,
      clientSecret: config.clientSecret
    }).reply(200, {
      access_token: ACCESS_TOKEN,
      token_type: 'Bearer'
    })
}

async function refreshToken() {
  return refreshApiToken()
}

function createJWTToken(payload: any = {email: 'foo@bar.com'}) {
  return jwt.sign(
      payload,
      new Buffer(config.clientSecret, 'base64'),
      {audience: config.clientId, issuer: 'auth0'}
    )
}

export default {
  startServer,
  stopServer,
  config,
  mockGetToken,
  refreshToken,
  ACCESS_TOKEN,
  getServer: server.getServer,
  createJWTToken
}
