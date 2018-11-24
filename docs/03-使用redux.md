# 1. 使用redux
+ 与之前使用redux的方法一样，创建一个`store`的目录，把所有的`reducer`数据全部存储到这里，在客户端直接拿来使用，在服务器端，把`StaticRouter`使用`Provider`进行包裹
+ 然后可以在服务器端渲染页面的时候，把`reducer`的默认值渲染出来
+ 如果`reducer`里的值是需要通过ajax获取的，那么就需要做一些其他的设置，因为服务器端没有componentDidMount这个方法

# 2. 使用redux做服务端渲染

+ 在需要异步获取路由的组件里，添加一个`loadData`的方法，用来异步获取数据，挂载在routes里

```javascript
// 负责在服务器端渲染之前，把这个路由需要的数据提前加载好
Home.loadData = (store) => {
  return store.dispatch(HomeCreateActions.getNewsListProps());
};
```


+ 要使用服务端渲染，那么路由就要做相应的修改，之前的路由方法不能做服务端渲染
```javascript
// before
export default (
  <Fragment>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
  </Fragment>
);

```

```javascript
// after
const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
    loadData: Home.loadData,
    key: 'home',
  },
  {
    path: '/login',
    component: Login,
    exact: true,
    key: 'login'
  }
];

export default routes;
```

+ 客户端和服务端使用路由，方式是一样的
```javascript
<div>
  {routes.map(route => (
    <Route {...route}/>
  ))}
</div>
```

+ 路由修改完毕之后，就需要开始修整使用redux
    + 之所有服务端没有把需要异步请求的数据渲染出来，就是因为在页面初始化的时候，store是空的
    + 所以，我们需要获取到store里的值，但是store里具体需要什么样的值，需要结合当前用户的url和路由做相应的判断。如果用户访问的是/，那么就调用Home组件的loadData方法，获取Home组件的异步数据。如果用户访问的是/login，那么就调用的是Login组件的loadData方法，获取Login组件的异步数据。
    + 根据路由的路径获取的数据，加入到store里即可。

+ 多级路由
被匹配到的路由应该是所有的路由`routes`与用户请求的url地址`req.path`相匹配，所以这里用到的是`react-router-config`这个库，得到的`matchedRoutes`就是匹配到的库，得到的是一个数组

```javascript
import { matchRoutes } from 'react-router-config';

const matchedRoutes = matchRoutes(routes, req.path);
```

+ 匹配到的路由数据加载
    + 当路由被匹配到，判断这个路由的里的组件是否有`loadData`这个方法，如果有这个方法，就把这个方法暂存到一个`promises`数组里。
    + 然后使用`Promise.all`方法对`promises`数组里的数据进行获取，最终把获取到的数据存储到`store`里，渲染页面。

```javascript
matchedRoutes.forEach(item => {
  if (item.route.loadData) {
    promises.push(item.route.loadData(store));
  }
});

global.Promise.all(promises).then(() => {
  res.send(render(store, routes, req));
});
```

+ 在render方法里追加相应的参数
+ 数据的注水和脱水
在服务器端已经获取到了`store`里的值，然后把所有的`state`的值注水到要渲染的页面里

```html
<script >
  // 数据注水
  window.context = {
    state: ${JSON.stringify(store.getState())}
  }
</script>
```

在客户端的`store`里，使用服务端已经注入的`store`，直接获取，无需再次获取数据

```javascript
export const getClientStore = () => {
  // 客户端的数据脱水
  const defaultState = window.context.state;
  return createStore(
    reducer,
    defaultState,
    composeWithDevTools(applyMiddleware(thunk))
  );
};
```


