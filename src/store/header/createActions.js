import * as HomeActionTypes from './actionTypes';

const changeLogin = bool => ({
  type: HomeActionTypes.CHANGE_LOGIN_STATUS,
  login: bool,
});

export const loginStatus = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/login').then(response => {
      if (response.status === 200) {
        dispatch(changeLogin(true));
      }
    });
  };
};

export const logoutStatus = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/logout').then(response => {
      if (response.status === 200) {
        dispatch(changeLogin(false));
      }
    });
  };
};

export const getHeaderInfo = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/isLogin').then(response => {
      if (response.status === 200) {
        dispatch(changeLogin(response.data.data.login));
      }
    });
  };
};