import {
  CREATE_VEHICLE_START,
  CREATE_VEHICLE_ERROR,
  CREATE_VEHICLE_SUCCESS,
  READ_VEHICLE_START,
  READ_VEHICLE_ERROR,
  READ_VEHICLE_SUCCESS,
  UPDATE_VEHICLE_START,
  UPDATE_VEHICLE_ERROR,
  UPDATE_VEHICLE_SUCCESS,
  REMOVE_VEHICLE_START,
  REMOVE_VEHICLE_ERROR,
  REMOVE_VEHICLE_SUCCESS
} from '../actions/vehicle'

const initialState = {
  vehicle: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VEHICLE_SUCCESS:
      return { ...state, vehicle: action.data }

    case READ_VEHICLE_SUCCESS:
      return { ...state, vehicle: action.data }

    case UPDATE_VEHICLE_SUCCESS:
      return { ...state, vehicle: action.data }

    case REMOVE_VEHICLE_SUCCESS:
      return { ...state, vehicle: {} }

    case CREATE_VEHICLE_START:
    case CREATE_VEHICLE_ERROR:
    case READ_VEHICLE_START:
    case READ_VEHICLE_ERROR:
    case UPDATE_VEHICLE_START:
    case UPDATE_VEHICLE_ERROR:
    case REMOVE_VEHICLE_START:
    case REMOVE_VEHICLE_ERROR:
    default:
      return state
  }
}
