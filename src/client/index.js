import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import routes from '../Routes';
import { getClientStore } from '../store/';

window._store = store;

const store = getClientStore();

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        {renderRoutes(routes)}
      </div>
    </BrowserRouter>
  </Provider>
);
// React16提供了一个函数hydrate()，在服务端渲染时用来替代render，hydrate不会对dom进行修补只会对文本进行修补，如果文本不一样使用客户端的文本内容
ReactDom.hydrate(<App/>, document.getElementById('root'));
