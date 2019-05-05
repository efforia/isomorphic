import hardwareService from '../services/hardware'

/* --------- Watch for Bluetooth Enabled State Changes --------- */
export const ON_BLUETOOTH_STATE_CHANGE_START = 'ON_BLUETOOTH_STATE_CHANGE_START'
export const ON_BLUETOOTH_STATE_CHANGE_ERROR = 'ON_BLUETOOTH_STATE_CHANGE_ERROR'
export const ON_BLUETOOTH_STATE_CHANGE_SUCCESS = 'ON_BLUETOOTH_STATE_CHANGE_SUCCESS'

export const onBluetoothStateChangeStart = () => ({
  type: ON_BLUETOOTH_STATE_CHANGE_START
})

export const onBluetoothStateChangeError = () => ({
  type: ON_BLUETOOTH_STATE_CHANGE_ERROR
})

export const onBluetoothStateChangeSuccess = isEnabled => ({
  type: ON_BLUETOOTH_STATE_CHANGE_SUCCESS,
  isEnabled
})

export const watchBluetoothStateChanges = () => dispatch => {
  dispatch(onBluetoothStateChangeStart())
  return new Promise(resolve => {
    hardwareService.onBluetoothStateChange(bluetoothState => {
      const isEnabled = hardwareService.isBluetoothEnabledState(bluetoothState)
      resolve(isEnabled)
      dispatch(onBluetoothStateChangeSuccess(isEnabled))
    })
  })
}

/* --------- Check for Bluetooth Enabled State --------- */
export const CHECK_BLUETOOTH_STATE_START = 'CHECK_BLUETOOTH_STATE_START'
export const CHECK_BLUETOOTH_STATE_ERROR = 'CHECK_BLUETOOTH_STATE_ERROR'
export const CHECK_BLUETOOTH_STATE_SUCCESS = 'CHECK_BLUETOOTH_STATE_SUCCESS'

export const checkBluetoothStateStart = () => ({
  type: CHECK_BLUETOOTH_STATE_START
})

export const checkBluetoothStateError = () => ({
  type: CHECK_BLUETOOTH_STATE_ERROR
})

export const checkBluetoothStateSuccess = isEnabled => ({
  type: CHECK_BLUETOOTH_STATE_SUCCESS,
  isEnabled
})

export const checkBluetoothState = () => dispatch =>
  new Promise(resolve => {
    hardwareService
      .checkBluetoothState()
      .then(isEnabled => {
        resolve(isEnabled)
        dispatch(checkBluetoothStateStart())
        dispatch(checkBluetoothStateSuccess(isEnabled))
      })
      .catch(() => {
        resolve(false)
        dispatch(checkBluetoothStateStart())
        dispatch(checkBluetoothStateSuccess(false))
      })
  })

/* --------- Watch for GPS Enabled State Changes --------- */
export const ON_GPS_STATE_CHANGE_START = 'ON_GPS_STATE_CHANGE_START'
export const ON_GPS_STATE_CHANGE_ERROR = 'ON_GPS_STATE_CHANGE_ERROR'
export const ON_GPS_STATE_CHANGE_SUCCESS = 'ON_GPS_STATE_CHANGE_SUCCESS'

export const onGpsStateChangeStart = () => ({
  type: ON_GPS_STATE_CHANGE_START
})

export const onGpsStateChangeError = () => ({
  type: ON_GPS_STATE_CHANGE_ERROR
})

export const onGpsStateChangeSuccess = isEnabled => ({
  type: ON_GPS_STATE_CHANGE_SUCCESS,
  isEnabled
})

export const watchGpsStateChanges = () => dispatch => {
  dispatch(onGpsStateChangeStart())
  return new Promise(resolve => {
    hardwareService.onGpsStateChange(bluetoothState => {
      const isEnabled = hardwareService.isGpsEnabledState(bluetoothState)
      resolve(isEnabled)
      dispatch(onGpsStateChangeSuccess(isEnabled))
    })
  })
}

/* --------- Check for GPS Enabled State --------- */
export const CHECK_GPS_STATE_START = 'CHECK_GPS_STATE_START'
export const CHECK_GPS_STATE_ERROR = 'CHECK_GPS_STATE_ERROR'
export const CHECK_GPS_STATE_SUCCESS = 'CHECK_GPS_STATE_SUCCESS'

export const checkGpsStateStart = () => ({
  type: CHECK_GPS_STATE_START
})

export const checkGpsStateError = () => ({
  type: CHECK_GPS_STATE_ERROR
})

export const checkGpsStateSuccess = isEnabled => ({
  type: CHECK_GPS_STATE_SUCCESS,
  isEnabled
})

export const checkGpsState = () => dispatch =>
  new Promise(resolve => {
    hardwareService
      .checkGpsState()
      .then(isEnabled => {
        resolve(isEnabled)
        dispatch(checkGpsStateStart())
        dispatch(checkGpsStateSuccess(isEnabled))
      })
      .catch(() => {
        resolve(false)
        dispatch(checkGpsStateStart())
        dispatch(checkGpsStateSuccess(false))
      })
  })
