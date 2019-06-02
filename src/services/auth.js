import axios from 'axios'
import hello from 'hellojs'

import config from '../config'

import localStorageService from './localstorage'

import { USER_TOKEN } from '../config/consts'

const isLoggedIn = () => {
  const token = localStorage.getItem(USER_TOKEN)
  return !!token
}

const login = params => axios.post(`${config.baseUrl}/login`, params)

const getLoggedInUser = () => {
  const state = localStorageService.getState()
  if (state.user) {
    const userState = JSON.parse(state.user)
    return userState.profile || {}
  }
  return {}
}

const accessWithGoogle = () =>
  new Promise((resolve, reject) => {
    try {
      hello('google')
        .login({ redirect_uri: window.location.href.substring(0, window.location.href.length - 1) })
        .then(() => {
          hello('google')
            .api('me')
            .then(r => {
              resolve(r)
            })
        })
    } catch (e) {
      reject(e)
    }
  })

const getUserToken = () => localStorage.getItem(USER_TOKEN)

const setUserToken = token => localStorage.setItem(USER_TOKEN, token)

const getAuthorizationHeader = () => `Bearer ${localStorage.getItem(USER_TOKEN)}`

const logout = () => localStorage.removeItem(USER_TOKEN)

export default {
  login,
  isLoggedIn,
  getLoggedInUser,
  getUserToken,
  logout,
  setUserToken,
  getAuthorizationHeader,
  accessWithGoogle
}
