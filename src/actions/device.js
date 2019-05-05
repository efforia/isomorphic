import deviceService from '../services/device'
import beaconService from '../services/beacon'

export const FIND_NEARBY_DEVICES_START = 'FIND_NEARBY_DEVICES_START'
export const FIND_NEARBY_DEVICES_ERROR = 'FIND_NEARBY_DEVICES_ERROR'
export const FIND_NEARBY_DEVICES_SUCCESS = 'FIND_NEARBY_DEVICES_SUCCESS'

export const findNearbyDevicesStart = () => ({
  type: FIND_NEARBY_DEVICES_START
})

export const findNearbyDevicesError = () => ({
  type: FIND_NEARBY_DEVICES_ERROR
})

export const findNearbyDevicesSuccess = device => ({
  type: FIND_NEARBY_DEVICES_SUCCESS,
  device
})

export const findNearbyDevices = () => dispatch => {
  dispatch(findNearbyDevicesStart())
  beaconService.scan(5000, device => {
    dispatch(findNearbyDevicesSuccess(device))
  })
}

export const CLEAR_NEARBY_DEVICES_START = 'CLEAR_NEARBY_DEVICES_START'
export const CLEAR_NEARBY_DEVICES_ERROR = 'CLEAR_NEARBY_DEVICES_ERROR'
export const CLEAR_NEARBY_DEVICES_SUCCESS = 'CLEAR_NEARBY_DEVICES_SUCCESS'

export const clearNearbyDevicesStart = () => ({
  type: CLEAR_NEARBY_DEVICES_START
})

export const clearNearbyDevicesError = () => ({
  type: CLEAR_NEARBY_DEVICES_ERROR
})

export const clearNearbyDevicesSuccess = () => ({
  type: CLEAR_NEARBY_DEVICES_SUCCESS
})

export const clearNearbyDevices = () => dispatch => {
  dispatch(clearNearbyDevicesStart())
  dispatch(clearNearbyDevicesSuccess())
}

export const SELECT_DEVICE_START = 'SELECT_DEVICE_START'
export const SELECT_DEVICE_ERROR = 'SELECT_DEVICE_ERROR'
export const SELECT_DEVICE_SUCCESS = 'SELECT_DEVICE_SUCCESS'

export const selectDeviceStart = () => ({
  type: SELECT_DEVICE_START
})

export const selectDeviceError = () => ({
  type: SELECT_DEVICE_ERROR
})

export const selectDeviceSuccess = device => ({
  type: SELECT_DEVICE_SUCCESS,
  device
})

export const selectDevice = device => dispatch => {
  dispatch(selectDeviceStart(device))
  dispatch(selectDeviceSuccess(device))
}

export const CONNECT_TO_DEVICE_START = 'CONNECT_TO_DEVICE_START'
export const CONNECT_TO_DEVICE_ERROR = 'CONNECT_TO_DEVICE_ERROR'
export const CONNECT_TO_DEVICE_SUCCESS = 'CONNECT_TO_DEVICE_SUCCESS'
export const DEVICE_CONNECTION_LOST = 'DEVICE_CONNECTION_LOST'

export const connectToDeviceStart = () => ({
  type: CONNECT_TO_DEVICE_START
})

export const connectToDeviceError = () => ({
  type: CONNECT_TO_DEVICE_ERROR
})

export const connectToDeviceSuccess = device => ({
  type: CONNECT_TO_DEVICE_SUCCESS,
  device
})

export const onDeviceDisconnection = device => ({
  type: DEVICE_CONNECTION_LOST,
  device
})

export const connectToDevice = device => dispatch => {
  dispatch(connectToDeviceStart())
  return new Promise((resolve, reject) => {
    try {
      beaconService.connect(
        device.id,
        () => {
          dispatch(connectToDeviceSuccess(device))
          resolve(device)
        },
        e => {
          dispatch(onDeviceDisconnection(e))
          reject(e)
        }
      )
    } catch (e) {
      dispatch(connectToDeviceError(e))
      reject(e)
    }
  })
}

export const ADD_DEVICE_START = 'ADD_DEVICE_START'
export const ADD_DEVICE_ERROR = 'ADD_DEVICE_ERROR'
export const ADD_DEVICE_SUCCESS = 'ADD_DEVICE_SUCCESS'

export const addDeviceStart = () => ({
  type: ADD_DEVICE_START
})

export const addDeviceError = () => ({
  type: ADD_DEVICE_ERROR
})

export const addDeviceSuccess = device => ({
  type: ADD_DEVICE_SUCCESS,
  device
})

export const addDevice = device => dispatch => {
  dispatch(addDeviceStart(device))
  return new Promise((resolve, reject) => {
    deviceService
      .create(device)
      .then(response => {
        dispatch(addDeviceSuccess(response.data.data))
        resolve(response.data.data)
      })
      .catch(e => {
        dispatch(addDeviceError(e))
        reject(e)
      })
  })
}

export const TOGGLE_DEVICE_START = 'TOGGLE_DEVICE_START'
export const TOGGLE_DEVICE_ERROR = 'TOGGLE_DEVICE_ERROR'
export const TOGGLE_DEVICE_SUCCESS = 'TOGGLE_DEVICE_SUCCESS'

export const toggleDeviceStart = () => ({
  type: TOGGLE_DEVICE_START
})

export const toggleDeviceError = () => ({
  type: TOGGLE_DEVICE_ERROR
})

export const toggleDeviceSuccess = () => ({
  type: TOGGLE_DEVICE_SUCCESS
})

export const toggleDevice = () => dispatch => {
  dispatch(toggleDeviceStart())
  dispatch(toggleDeviceSuccess())
}
