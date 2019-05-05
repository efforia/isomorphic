/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Environment configuration.
 */

const dev = {
  baseUrl: 'https://api-argo-instant-dev.azurewebsites.net'
}

const local = {
  ...dev,
  baseUrl: 'localhost:3001'
}

const prod = {
  baseUrl: 'https://api-argo-instant-dev.azurewebsites.net'
}

const envs = {
  local,
  dev,
  prod
}

const config = envs[process.env.REACT_APP_STAGE || process.env.npm_config_stage || 'dev']

export default {
  ...config
  // Add common config values here
}
