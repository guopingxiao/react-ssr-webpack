# 1. Node中间层
+ Node中间层服务端的端口是`8888`
+ Java服务端口是`3000`

### 1.1 Proxy代理请求转发
+ 使用express-http-proxy做请求的转发
+ `proxy`的第一参数就是转发的url地址
+ 在`http://localhost:3000`服务里，要把所有的url地址对应起来

```javascript
import proxy from 'express-http-proxy';

app.use('/api', proxy('http://localhost:3000', {
  proxyReqPathResolver: function (req) {
    return `/api${req.url}`;
  }
}));

```

### 1.2 客户端和服务端请求的不同处理
+ 服务端请求的url地址是`http://localhost:3000`
+ 客户端请求的url地址是`http://localhost:8888`
+ 客户端请求的url被Node.js中间层进行代理转发，也就是客户端的请求(http://localhost:8888/api/translationList)先到达Node中间层，然后Node服务请求Java服务，Node服务请求的url地址是(http://localhost:3000/api/translationList)
+ 所以，客户端和Node端请求的url地址是不一样的，要对不同的端请求的url地址做一些不同的处理
+ 使用axios的instance可以根据用户的配置创建一个axios的实例

```javascript
// 这里是客户端，服务端同样需要这样的配置，只是需要修改baseURL地址
import axios from 'axios';

const clientAxios = axios.create({
  baseURL: ''
});

export default clientAxios;
```
+ 创建完毕之后，需要引入到redux中
在redux-thunk中，有一个方法`thunk.withExtraArgument(clientAxios)`
+ 在store中使用thunk的withExtraArgument方法

```javascript
// 这里是客户端，服务端同样需要这样的配置 
export const getClientStore = () => {
  // 客户端的数据脱水
  const defaultState = window.context.state;
  return createStore(
    reducer,
    defaultState,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(clientAxios)))
  );
};
```

+ redux-thunk源码

```javascript
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```



+ 在redux中使用的时候，直接使用第三个参数进行请求

```javascript
export const getTranslationList = () => {
  return (dispatch, getStatus, axiosInstance) => {
    return axiosInstance.get('/api/translationList').then(response => {
      const translation = response.data.data || [];
      dispatch(getTranslationListState(translation));
    });
  };
};
```

### 1.3 使用多级路由
+ 使用多级路由就是把公共的部分抽离出来，放在一个公共的地方，在组件使用的时候，直接引用公共部分就可以
+ 首先，要创建一个公共的组件用来显示公共的内容

```javascript
// 这里公共的部分是Header组件
import React, {Fragment} from 'react';
import {renderRoutes} from 'react-router-config';

import Header from './components/Header';

const App = (props) => {
  return (
    <Fragment>
      <Header/>
      {renderRoutes(props.route.routes)}
    </Fragment>
  )
};

export default App;
```

+ 在渲染路由的时候，需要使用到`react-router-config`库里的`renderRoutes`方法，可以把对应的routes进行包装`renderRoutes(routes)`，同时还需要把`routes`做成多级路由，最终在App里对路由进行渲染并显示

```javascript
import {renderRoutes} from 'react-router-config';

const App = (props) => {
  return (
    <Fragment>
      <PublicComponent/>
      {renderRoutes(props.route.routes)}
    </Fragment>
  )
};
```
+ 在服务端和客户端渲染的路由要做相应的修改

```javascript
// 注释掉的内容是要被删掉的内容
// 把注释掉的内容换成下边的那一行即可
import { renderRoutes } from 'react-router-config';

<Provider store={store}>
  <StaticRouter location={req.path} context={{}}>
    <div>
      {/*{routes.map(route => (*/}
        {/*<Route {...route}/> */}
      {/* ))}*/}
    {renderRoutes(routes)}
    </div>
  </StaticRouter>
</Provider>
```

### 1.4 cookie传递
+ 在Node层进行转发的时候，是没有cookie信息的，所以要把cookie信息转发给Java服务，用来做验证信息。
+ 所以，在Node端获取到cookie的时候，通过`getStore`方法进行存储`req`信息，再把`req`信息转发给`store`，在`store`中传递`req`信息
+ 在`store`中的`serverAxios`获取到`req`参数，最终把`cookie`传递给Java

```javascript
// server/index.js  Node.js端的store获取到req信息
const store = getServerStore(req);

// store/index.js  store把req信息传递给serverAxios
export const getServerStore = (req) => createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk.withExtraArgument(serverAxios(req))))
);

// server/request.js serverAxios获取到req信息即可
const serverAxios = req => axios.create({
  baseURL: 'http://localhost:8758',
  headers: {
    cookie: req.get('cookie') || ''
  }
});
```
+ 在这里还可以传递公共的参数，加入有一个固定的参数需要传递，那么就把可以在axios中进行传递，这样每次的请求都会带上这个参数

```javascript
const serverAxios = req => axios.create({
  baseURL: 'http://localhost:8758',
  headers: {
    cookie: req.get('cookie') || ''
  },
  params: {
    secret: 'your secret message'
  }
});
```
