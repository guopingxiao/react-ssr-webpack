# 1. 使用CSS样式

+ 使用CSS样式，需要在客户端和服务器端共同加入CSS样式，所以我们需要在webpack中添加使用`css-loader`和`style-loader`
+ 然而，问题就在于，客户端使用`css-loader`和`style-loader`没有任何问题，因为客户端有window对象，样式可以挂载在window对象上。
+ 但是服务器端没有window对象，所以，在服务器端使用`style-loader`是会报错的，所以，我们使用一个可以在服务器端使用的css的loader，叫做`isomorphic-style-loader`
+ 配置客户端的webpack

```javascript
const clientConfig = {
  mode: 'development',
  entry: './src/client/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: ['style-loader', {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:5]'
          }
        }]
      }
    ]
  }
};
```

+ 配置服务器端的webpack

```javascript
const serverConfig = {
  target: 'node',
  mode: 'development',
  entry: './src/server/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build/')
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: ['isomorphic-style-loader', {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:5]'
          }
        }]
      }
    ]
  }
};
```
+ 配置公共的基础的webpack

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['react', 'stage-0', ['env', {
            targets: {
              browsers: ['last 2 versions']
            }
          }]], // babel-preset-react
        }
      }
    ]
  }
};

```

### 1.1 客户端使用css样式
+ isomorphic-style-loader直接引入css文件，在需要样式的dom元素上加上相应的类名，怎么取到其css的内容呢？;style-loader是会将class加载在html中，并将其内容挂载在header上；

```javascript
// home.js
import styles from './index.css';

<p className={styles.home}>HOME PAGE</p>
```

### 1.2 服务器端使用css样式
+ 需要把组件里的css样式，通过生命周期钩子函数挂载到`staticContext`中
+ 服务器端render函数拿到这个`staticContext`之后，可以注入到`html`中`head`里

```javascript
// home.js
componentWillMount () {
  if (this.props.staticContext) { // 区别客户端渲染，通过_getCss()方法拿到css样式；
    this.props.staticContext.css = styles._getCss();
  }
}


// server/utils.js
const cssStr = context.css ? context.css : '';

const html = `
  <!-- ..... -->
  <head>
    <meta charset="UTF-8">
    <title>React Server Render</title>
    <style>${cssStr}</style>
  </head>
  <!-- ..... -->
`;
```

### 1.3 多组件使用css样式
+ 如果像1.2里一样，在home组件里把样式挂载到`staticContext.css`中
+ 假如在`header`组件中，也这么做，那么就会出现这种情况， staticContext 只能传递给路由的组件上，我们可以将context传进去

```javascript
// header.js
componentWillMount () {
  if (this.props.staticContext) {
    this.props.staticContext.css = styles._getCss();
  }
}

// home.js
componentWillMount () {
  if (this.props.staticContext) {
    this.props.staticContext.css = styles._getCss();
  }
}
```
+ 我们可以发现，传递给服务器端的css先被header组件赋值，再被home组件赋值，这样的结果就是header组件的样式被洗掉，而不是css样式覆盖。
+ 所以，我们不能这么做，要使用css作为一个数组，在每一个组件中把样式push进css数组中，然后在服务器端把这个css数组解析出来，然后注入到`html`中
+ `import styles from "./style.css"`，在这里的`styles`里，里边有一些属性和方法

```javascript
{ 
  home: 'index_home_3-8eU',
  _getContent: [Function],
  _getCss: [Function],
  _insertCss: [Function] 
}
```
+ 我们使用`styles._getCss()`这个方法，获取到客户端里载入的css样式代码
+ 在服务器端要用数组接收到这个样式，所以在服务器端的`context`里增加一个`css`为数组的属性
```javascript
const context = {css: []};
```
+ 在客户端，我们需要样式都`push`进css数组中

```javascript
// home.js
componentWillMount () {
  if (this.props.staticContext) {
    this.props.staticContext.css.push(styles._getCss());
  }
}
```
+ 然后再到服务端，把css数组进行解析，换行后注入到html中

```javascript
// server/utils.js
const cssStr = context.css.length ? context.css.join('\n') : '';
```
+ 由于header组件是公共组件，所以需要在App中把`staticContext`传递给header组件
这样header组件就有了staticContext属性，就可以把css样式`push`进css数组中

```javascript
const App = (props) => {
  return (
    <Fragment>
      <Header staticContext={props.staticContext}/>
      {renderRoutes(props.route.routes)}
    </Fragment>
  );
};
```

### 1.4 使用高阶组件把需要的公共的样式方法提取出来
如何避免在每个中间中都去写这一段代码呢？
```javascript
componentWillMount () {
  if (this.props.staticContext) {
    this.props.staticContext.css.push(styles._getCss());
  }
}
```
+ 由于每一个需要样式的组件里，都需要把css样式`push`进css数组中，所以我们可以使用一个高阶组件，把需要的公共样式提取出来
```javascript
// home.js
componentWillMount () {
  if (this.props.staticContext) {
    this.props.staticContext.css.push(styles._getCss());
  }
}
```
+ 新建一个`withStyle.js`的文件，写下以下的代码

```javascript
import React, { Component } from 'react';

// 生成高阶组件的函数
// 入参是一个组件，返回的也是一个组件，返回的组件叫高阶组件
export default (DecoratedComponent, styles) => {
  return class NewComponent extends Component {
    componentWillMount () {
      if (this.props.staticContext) {
        this.props.staticContext.css.push(styles._getCss());
      }
    }
    
    render () {
      return (<DecoratedComponent {...this.props} />);
    }
    
  };
};
```
+ 高阶组件完成之后，假设home组件要使用样式，就可以这样，把组件和样式作为参数传递进去即可。

```javascript
import styles from './index.css';
import withStyle from '../../withStyle';

connect(mapStateToProps, mapDispatchToProps)(withStyle(Home, styles));
```

### 1.5 关于`loadData`方法的修改与完善
+ 之前我们是这么写的`loadData`方法，假如不使用`connect`，那么导出的`ExtraHome`是不会有`loadData`方法的，之所有有`loadData`方法，是因为`connect`帮我们做的

```javascript
// before
Home.loadData = store => {
  return store.dispatch(HomeCreateActions.getNewsListProps());
};
const ExtraHome = connect(mapStateToProps, mapDispatchToProps)(Home);
```
+ 所以，我们要把`loadData`方法挂载到`ExtraHome`上，这样，就算不用`connect`，`ExtraHome`也可以有`loadData`方法，也会更加直观。

```javascript
// after
const ExtraHome = connect(mapStateToProps, mapDispatchToProps)(Home);

ExtraHome.loadData = store => {
  return store.dispatch(HomeCreateActions.getNewsListProps());
};

export default ExtraHome;
```
