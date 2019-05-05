import axios from 'axios'

import config from '../config'

import { USER_TOKEN, USER_FULL_NAME, USER_ID } from '../config/consts'

const isLoggedIn = () => {
  const token = localStorage.getItem(USER_TOKEN)
  return !!token
}

const getUserId = () => {
  const id = localStorage.getItem(USER_ID)
  return id || ''
}

const getFullName = () => {
  const name = localStorage.getItem(USER_FULL_NAME)
  return name || ''
}

const getName = () => {
  const name = getFullName().split(' ')[0]
  return name || ''
}

const getAuthorization = () => `Bearer ${localStorage.getItem(USER_TOKEN)}`

const login = params => axios.post(`${config.baseUrl}/login`, params)

const setLoginItems = ({ id, token, name }) =>
  new Promise(resolve => {
    localStorage.setItem(USER_ID, id)
    localStorage.setItem(USER_TOKEN, token)
    localStorage.setItem(USER_FULL_NAME, name)
    resolve()
  })

const logout = () =>
  new Promise(resolve => {
    localStorage.removeItem(USER_ID)
    localStorage.removeItem(USER_TOKEN)
    localStorage.removeItem(USER_FULL_NAME)
    resolve()
  })

export default {
  isLoggedIn,
  getUserId,
  getName,
  getFullName,
  getAuthorization,
  setLoginItems,
  login,
  logout
}
