import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducer from './reducers';
import clientAxios from '../client/request';
import serverAxios from '../server/request';

export const getServerStore = (req) => createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk.withExtraArgument(serverAxios(req))))
);

export const getClientStore = () => {
  // 客户端的数据脱水
  const defaultState = window.context.state;
  return createStore(
    reducer,
    defaultState,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(clientAxios)))
  );
};