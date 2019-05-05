import axios from 'axios'
import config from '../config'
import authService from './auth'

const create = params =>
  axios.post(`${config.baseUrl}/user`, params, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

const read = () =>
  axios.get(`${config.baseUrl}/user`, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

const update = params =>
  axios.put(`${config.baseUrl}/user`, params, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

const createRiskForm = params =>
  axios.post(`${config.baseUrl}/risk_analysis`, params, {
    headers: {
      Authorization: authService.getAuthorization()
    }
  })

export default { create, read, update, createRiskForm }
