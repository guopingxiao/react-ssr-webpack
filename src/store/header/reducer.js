import * as HeaderActionTypes from './actionTypes';

const defaultStatus = {
  login: false,
};

export default (state = defaultStatus, action) => {
  switch (action.type) {
    case HeaderActionTypes.CHANGE_LOGIN_STATUS:
      return {
        ...state,
        login: action.login,
      };
    default:
      return state;
  }
};
