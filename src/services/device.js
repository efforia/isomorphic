import axios from 'axios'
import config from '../config'
import authService from './auth'

const create = params =>
  axios.post(`${config.baseUrl}/device`, params, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

const read = () =>
  axios.get(`${config.baseUrl}/device`, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

const update = params =>
  axios.put(`${config.baseUrl}/device`, params, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

const remove = params =>
  axios.delete(`${config.baseUrl}/device`, params, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

export default { create, read, update, remove }
