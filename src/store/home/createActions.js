import * as HomeActionTypes from './actionTypes';

const getNewsListTypes = newsList => ({
  type: HomeActionTypes.GET_NEWS_LIST,
  newsList,
});

export const getNewsListProps = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/newsList').then(response => {
      if (response.status === 200) {
        const newsList = response.data;
        dispatch(getNewsListTypes(newsList));
      }
    });
  };
};