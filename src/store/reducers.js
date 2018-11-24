import { combineReducers } from 'redux';
import HomeReducer from './home/reducer';
import HeaderReducer from './header/reducer';
import TranslationReducer from './translation/reducer';

export default combineReducers({
  home: HomeReducer,
  header: HeaderReducer,
  translation: TranslationReducer,
});