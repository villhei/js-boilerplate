/* @flow */

import health from './api/health'
import auth from './api/v1/auth/login'
import logout from './api/v1/auth/logout'
import signup from './api/v1/auth/signup'
import authTest from './api/v1/auth/authTest'
import jobs from './api/v1/jobs'
import profile from './api/v1/profile'
import jwt from 'express-jwt'
import request from 'request-promise'
import winston from 'winston'

import type { UrapalveluServerConfig } from './config'
import type { $Application as Application } from 'express'


async function configureUserAuthentication(config: UrapalveluServerConfig) {
  winston.info('Attempting to configure API authentication with URA-API')
  try {
    const authConfig = await request({
      method: 'GET',
      uri: config.uraApi.apiUrl + '/auth/config',
      json: true
    })
    winston.info('Configuring API authentication with the config:', authConfig)
    /**
     *  The audience field must be configured to urapalvelu clientId in order
     *  to have the user's authentication checkable
     */
    return jwt({
      secret: new Buffer(config.clientSecret, 'base64'),
      audience: config.clientId,
      issuer: authConfig.issuer
    })
  } catch (err) {
    winston.error('URA-API configuration failed with the error ', err)
    throw err
  }
}

export default async (config: UrapalveluServerConfig, app: Application) => {
  const apiPath: string = '/api'
  health(apiPath, app)
  try {
    const configuredJwt = await configureUserAuthentication(config)
    app.post(`${apiPath}/v1/auth/login`, auth.login(config))
    app.post(`${apiPath}/v1/auth/signup`, signup.signup(config))
    app.get(`${apiPath}/v1/auth/logout`, logout.logout(config))

    app.use(`${apiPath}/v1/auth/test`, configuredJwt)
    app.get(`${apiPath}/v1/auth/test`, authTest)

    app.get(`${apiPath}/v1/job/:id`, jobs.getJob(config))
    app.get(`${apiPath}/v1/jobs`, jobs.getJobs(config))
    app.get(`${apiPath}/v1/profiles/exists`, profile.userExists(config))
    app.use(`${apiPath}/v1/profile`, configuredJwt)
    app.get(`${apiPath}/v1/profile`, profile.getProfile(config))
    app.put(`${apiPath}/v1/profile`, profile.updateProfile(config))
  } catch (err) {
    app.get('*', (req: any, res: any) => {
      res.status(200).send('Oops! Try again later!, urapalvelu service is in maintenance')
    })
  }
}
