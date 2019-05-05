import {
  CREATE_PROFILE_START,
  CREATE_PROFILE_ERROR,
  CREATE_PROFILE_SUCCESS,
  READ_PROFILE_START,
  READ_PROFILE_ERROR,
  READ_PROFILE_SUCCESS,
  UPDATE_PROFILE_START,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_SUCCESS,
  AUTHENTICATE_START,
  AUTHENTICATE_ERROR,
  AUTHENTICATE_SUCCESS,
  CREATE_RISK_FORM_START,
  CREATE_RISK_FORM_ERROR,
  CREATE_RISK_FORM_SUCCESS,
  REMOVE_PROFILE
} from '../actions/user'

const initialState = {
  profile: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PROFILE_SUCCESS:
      return { ...state, profile: action.data }

    case READ_PROFILE_SUCCESS:
      return { ...state, profile: action.data }

    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: action.data }

    case AUTHENTICATE_SUCCESS:
      return { ...state, profile: action.data }

    case REMOVE_PROFILE:
      return { ...state, profile: {} }

    case CREATE_PROFILE_START:
    case CREATE_PROFILE_ERROR:
    case READ_PROFILE_START:
    case READ_PROFILE_ERROR:
    case UPDATE_PROFILE_START:
    case UPDATE_PROFILE_ERROR:
    case AUTHENTICATE_START:
    case AUTHENTICATE_ERROR:
    case CREATE_RISK_FORM_START:
    case CREATE_RISK_FORM_ERROR:
    case CREATE_RISK_FORM_SUCCESS:
    default:
      return state
  }
}
