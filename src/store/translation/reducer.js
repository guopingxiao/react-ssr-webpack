  import * as TranslationActionTypes from './actionTypes';

const defaultStatus = {
  translationList: [],
};

export default (state = defaultStatus, action) => {
  switch (action.type) {
    case TranslationActionTypes.TRANSLATION_LIST:
      return {
        ...state,
        translationList: action.translationList,
      };
    default:
      return state;
  }
};
