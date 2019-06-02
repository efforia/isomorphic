import axios from 'axios'
import config from '../config'
import authService from './auth'

const create = params =>
  axios.post(`${config.baseUrl}/user`, params, {
    headers: {
      Authorization: authService.getAuthorizationHeader()
    }
  })

const read = () =>
  axios.get(`${config.baseUrl}/user`, {
    headers: {
      Authorization: authService.getAuthorizationHeader()
    }
  })

const update = params =>
  axios.put(`${config.baseUrl}/user`, params, {
    headers: {
      Authorization: authService.getAuthorizationHeader()
    }
  })

export default { create, read, update }
