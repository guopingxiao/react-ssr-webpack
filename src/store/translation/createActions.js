import * as TranslationActionTypes from './actionTypes';

const getTranslationListState = translationList => ({
  type: TranslationActionTypes.TRANSLATION_LIST,
  translationList,
});

export const getTranslationList = () => {
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/translationList').then(response => {
      const translation = response.data.data || [];
      dispatch(getTranslationListState(translation));
    });
  };
};
