import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as HeaderCreateAction  from '../../store/header/createActions';
import styles from './styles.css';
import withStyle from '../../withStyle';

class Header extends Component {
  render () {
    const {login} = this.props;
    const {propsLogin, propsLogout} = this.props;
    return (
      <div className={styles.bg}>
        <Link to="/">首页</Link><br/>
        {
          login ?
            <Fragment>
              <Link to="/translation">翻译</Link><br/>
              <div to="/logout" onClick={propsLogout}>退出</div><br/>
            </Fragment> :
            <Fragment>
              <div to="/login" onClick={propsLogin}>登录</div><br/>
            </Fragment>
        }
      </div>
    );
  }
  
}

const mapStateToProps = state => ({
  login: state.header.login,
});

const mapDispatchToProps = dispatch => ({
  propsLogin(){
    dispatch(HeaderCreateAction.loginStatus());
  },
  propsLogout () {
    dispatch(HeaderCreateAction.logoutStatus());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyle(Header, styles));
