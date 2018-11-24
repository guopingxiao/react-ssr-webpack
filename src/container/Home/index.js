import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import styles from './index.css';
import * as HomeCreateActions from '../../store/home/createActions';
import withStyle from '../../withStyle';

class Home extends Component {
  render () {
    const { name } = this.props;
    return (
      <Fragment>
        <Helmet>
          <title>Home Page</title>
          <meta charSet="utf-8"/>
          <meta name="my home" content="努力学习react的SSR"/>
        </Helmet>
        <div>
          <p className={styles.home}>HOME PAGE</p>
          <h3>name: {name}</h3>
          <button onClick={() => { alert('clicked'); }}>click</button>
          <ul>
            {
              this.props.newsList.map((item) => {
                return <li key={item.id}>{item.title}</li>;
              })
            }
          </ul>
        </div>
      </Fragment>
    );
  }
  
  componentDidMount () {
    if (this.props.newsList.length === 0) {
      this.props.getNewsListProps();
    }
  }
}

const mapStateToProps = state => ({
  name: state.home.name,
  newsList: state.home.newsList,
});

const mapDispatchToProps = dispatch => ({
  getNewsListProps () {
    dispatch(HomeCreateActions.getNewsListProps());
  }
});

const ExtraHome = connect(mapStateToProps, mapDispatchToProps)(withStyle(Home, styles));

// 负责在服务器端渲染之前，把这个路由需要的数据提前加载好
ExtraHome.loadData = store => {
  return store.dispatch(HomeCreateActions.getNewsListProps());
};

export default ExtraHome;
