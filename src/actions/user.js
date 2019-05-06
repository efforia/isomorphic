import userService from '../services/user'

/* --------- Create --------- */
export const CREATE_PROFILE_START = 'CREATE_PROFILE_START'
export const CREATE_PROFILE_ERROR = 'CREATE_PROFILE_ERROR'
export const CREATE_PROFILE_SUCCESS = 'CREATE_PROFILE_SUCCESS'

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
        dispatch(updateProfileSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(updateProfileError(e))
        reject(e)
      })
  })
}