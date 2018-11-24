import React, { Component } from 'react';

// 生成高阶组件的函数
// 返回的组件叫高阶组件
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
