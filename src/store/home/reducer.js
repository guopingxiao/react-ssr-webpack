import * as HomeActionTypes from './actionTypes';

const defaultStatus = {
  name: 'mark',
  newsList: [],
};

export default (state = defaultStatus, action) => {
  switch (action.type) {
    case HomeActionTypes.GET_NEWS_LIST:
      return {
        ...state,
        newsList: action.newsList,
      };
    default:
      return state;
  }
};
