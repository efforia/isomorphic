import {
  FIND_NEARBY_DEVICES_START,
  FIND_NEARBY_DEVICES_ERROR,
  FIND_NEARBY_DEVICES_SUCCESS,
  CLEAR_NEARBY_DEVICES_START,
  CLEAR_NEARBY_DEVICES_ERROR,
  CLEAR_NEARBY_DEVICES_SUCCESS,
  SELECT_DEVICE_START,
  SELECT_DEVICE_ERROR,
  SELECT_DEVICE_SUCCESS,
  ADD_DEVICE_START,
  ADD_DEVICE_ERROR,
  ADD_DEVICE_SUCCESS,
  TOGGLE_DEVICE_START,
  TOGGLE_DEVICE_ERROR,
  TOGGLE_DEVICE_SUCCESS,
  CONNECT_TO_DEVICE_START,
  CONNECT_TO_DEVICE_ERROR,
  CONNECT_TO_DEVICE_SUCCESS,
  DEVICE_CONNECTION_LOST
} from '../actions/device'

const initialState = {
  nearby: [],
  selected: {},
  connected: {
    isEnabled: false
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FIND_NEARBY_DEVICES_SUCCESS:
      return { ...state, nearby: (state.nearby || []).concat(action.device) }

    case CLEAR_NEARBY_DEVICES_SUCCESS:
      return { ...state, nearby: [] }

    case SELECT_DEVICE_SUCCESS:
      return { ...state, selected: action.device }

    case CONNECT_TO_DEVICE_SUCCESS:
      return { ...state, connected: action.device }

    case DEVICE_CONNECTION_LOST:
      return { ...state, connected: {} }

    case ADD_DEVICE_SUCCESS:
      return { ...state, connected: { ...action.device, isEnabled: true } }

    case TOGGLE_DEVICE_SUCCESS:
      return { ...state, connected: { ...state.connected, isEnabled: !state.connected.isEnabled } }

    case FIND_NEARBY_DEVICES_START:
    case FIND_NEARBY_DEVICES_ERROR:
    case CLEAR_NEARBY_DEVICES_START:
    case CLEAR_NEARBY_DEVICES_ERROR:
    case SELECT_DEVICE_START:
    case SELECT_DEVICE_ERROR:
    case ADD_DEVICE_START:
    case ADD_DEVICE_ERROR:
    case CONNECT_TO_DEVICE_START:
    case CONNECT_TO_DEVICE_ERROR:
    case TOGGLE_DEVICE_START:
    case TOGGLE_DEVICE_ERROR:
    default:
      return state
  }
}
