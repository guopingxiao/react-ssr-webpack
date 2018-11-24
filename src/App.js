import React, { Fragment } from 'react';
import { renderRoutes } from 'react-router-config';
import Header from './container/Header/';
import * as HeaderCreateAction  from './store/header/createActions';

const App = (props) => {
  return (
    <Fragment>
      <Header staticContext={props.staticContext}/>
      {renderRoutes(props.route.routes)}
    </Fragment>
  );
};

App.loadData = store => {
  return store.dispatch(HeaderCreateAction.getHeaderInfo());
};

export default App;
