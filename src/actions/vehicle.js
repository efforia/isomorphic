import vehicleService from '../services/vehicle'

/* --------- Create --------- */
export const CREATE_VEHICLE_START = 'CREATE_VEHICLE_START'
export const CREATE_VEHICLE_ERROR = 'CREATE_VEHICLE_ERROR'
export const CREATE_VEHICLE_SUCCESS = 'CREATE_VEHICLE_SUCCESS'

export const createVehicleStart = () => ({
  type: CREATE_VEHICLE_START
})

export const createVehicleError = () => ({
  type: CREATE_VEHICLE_ERROR
})

export const createVehicleSuccess = data => ({
  type: CREATE_VEHICLE_SUCCESS,
  data
})

export const createVehicle = data => dispatch => {
  dispatch(createVehicleStart())
  return new Promise((resolve, reject) => {
    vehicleService
      .create(data)
      .then(response => {
        dispatch(createVehicleSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(createVehicleError(e))
        reject(e)
      })
  })
}

/* --------- Read --------- */
export const READ_VEHICLE_START = 'READ_VEHICLE_START'
export const READ_VEHICLE_ERROR = 'READ_VEHICLE_ERROR'
export const READ_VEHICLE_SUCCESS = 'READ_VEHICLE_SUCCESS'

export const readVehicleStart = () => ({
  type: READ_VEHICLE_START
})

export const readVehicleError = () => ({
  type: READ_VEHICLE_ERROR
})

export const readVehicleSuccess = data => ({
  type: READ_VEHICLE_SUCCESS,
  data
})

export const readVehicle = () => dispatch => {
  dispatch(readVehicleStart())
  return new Promise((resolve, reject) => {
    vehicleService
      .read()
      .then(response => {
        dispatch(readVehicleSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(readVehicleError(e))
        reject(e)
      })
  })
}

/* --------- Update --------- */
export const UPDATE_VEHICLE_START = 'UPDATE_VEHICLE_START'
export const UPDATE_VEHICLE_ERROR = 'UPDATE_VEHICLE_ERROR'
export const UPDATE_VEHICLE_SUCCESS = 'UPDATE_VEHICLE_SUCCESS'

export const updateVehicleStart = () => ({
  type: UPDATE_VEHICLE_START
})

export const updateVehicleError = () => ({
  type: UPDATE_VEHICLE_ERROR
})

export const updateVehicleSuccess = data => ({
  type: UPDATE_VEHICLE_SUCCESS,
  data
})

export const updateVehicle = data => dispatch => {
  dispatch(updateVehicleStart())
  return new Promise((resolve, reject) => {
    vehicleService
      .update(data)
      .then(response => {
        dispatch(updateVehicleSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(updateVehicleError(e))
        reject(e)
      })
  })
}
