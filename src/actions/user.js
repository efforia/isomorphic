import userService from '../services/user'
import authService from '../services/auth'

/* --------- Create --------- */
export const CREATE_PROFILE_START = 'CREATE_PROFILE_START'
export const CREATE_PROFILE_ERROR = 'CREATE_PROFILE_ERROR'
export const CREATE_PROFILE_SUCCESS = 'CREATE_PROFILE_SUCCESS'
export const SAVE_PROFILE = 'SAVE_PROFILE'

export const createProfileStart = () => ({
  type: CREATE_PROFILE_START
})

export const createProfileError = () => ({
  type: CREATE_PROFILE_ERROR
})

export const createProfileSuccess = data => ({
  type: CREATE_PROFILE_SUCCESS,
  data
})

export const createProfile = data => dispatch => {
  dispatch(createProfileStart())
  return new Promise((resolve, reject) => {
    userService
      .create(data)
      .then(response => {
        dispatch(createProfileSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(createProfileError(e))
        reject(e)
      })
  })
}

export const saveProfile = data => dispatch =>
  new Promise(resolve => {
    dispatch({ type: SAVE_PROFILE, data })
    resolve(data)
  })

/* --------- Read --------- */
export const READ_PROFILE_START = 'READ_PROFILE_START'
export const READ_PROFILE_ERROR = 'READ_PROFILE_ERROR'
export const READ_PROFILE_SUCCESS = 'READ_PROFILE_SUCCESS'

export const readProfileStart = () => ({
  type: READ_PROFILE_START
})

export const readProfileError = () => ({
  type: READ_PROFILE_ERROR
})

export const readProfileSuccess = data => ({
  type: READ_PROFILE_SUCCESS,
  data
})

export const readProfile = () => dispatch => {
  dispatch(readProfileStart())
  return new Promise((resolve, reject) => {
    userService
      .read()
      .then(response => {
        dispatch(readProfileSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(readProfileError(e))
        reject(e)
      })
  })
}

export const verifyEmail = email => dispatch =>
  userService.getByEmail(email).then(response => response.data.data)

/* --------- Update --------- */
export const UPDATE_PROFILE_START = 'UPDATE_PROFILE_START'
export const UPDATE_PROFILE_ERROR = 'UPDATE_PROFILE_ERROR'
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS'

export const updateProfileStart = () => ({
  type: UPDATE_PROFILE_START
})

export const updateProfileError = () => ({
  type: UPDATE_PROFILE_ERROR
})

export const updateProfileSuccess = data => ({
  type: UPDATE_PROFILE_SUCCESS,
  data
})

export const updateProfile = data => dispatch => {
  dispatch(updateProfileStart())
  return new Promise((resolve, reject) => {
    userService
      .update(data)
      .then(response => {
        dispatch(updateProfileSuccess(data))
        resolve(data)
      })
      .catch(e => {
        dispatch(updateProfileError(e))
        reject(e)
      })
  })
}

/* --------- Delete --------- */
export const REMOVE_PROFILE = 'REMOVE_PROFILE'

export const removeProfile = () => ({
  type: REMOVE_PROFILE
})

export const logout = () => dispatch => authService.logout()

/* --------- Authenticate --------- */
export const AUTHENTICATE_START = 'AUTHENTICATE_START'
export const AUTHENTICATE_ERROR = 'AUTHENTICATE_ERROR'
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS'

export const authenticateStart = () => ({
  type: AUTHENTICATE_START
})

export const authenticateError = () => ({
  type: AUTHENTICATE_ERROR
})

export const authenticateSuccess = data => ({
  type: AUTHENTICATE_SUCCESS,
  data
})

export const authenticate = data => dispatch => {
  dispatch(authenticateStart())
  return new Promise((resolve, reject) => {
    authService
      .login(data)
      .then(response => {
        dispatch(authenticateSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(authenticateError(e))
        reject(e)
      })
  })
}

export const REQUEST_NEW_PASSWORD_START = 'REQUEST_NEW_PASSWORD_START'
export const REQUEST_NEW_PASSWORD_ERROR = 'REQUEST_NEW_PASSWORD_ERROR'
export const REQUEST_NEW_PASSWORD_SUCCESS = 'REQUEST_NEW_PASSWORD_SUCCESS'

export const requestNewPasswordStart = () => ({
  type: REQUEST_NEW_PASSWORD_START
})

export const requestNewPasswordError = () => ({
  type: REQUEST_NEW_PASSWORD_ERROR
})

export const requestNewPasswordSuccess = data => ({
  type: REQUEST_NEW_PASSWORD_SUCCESS,
  data
})

export const requestNewPassword = data => dispatch => {
  dispatch(requestNewPasswordStart())
  return userService
    .requestPassword(data)
    .then(response => {
      dispatch(requestNewPasswordSuccess(response.data.data))
      return response.data.data
    })
    .catch(e => {
      dispatch(requestNewPasswordError())
    })
}
