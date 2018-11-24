import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as TranslationCreateActions from '../../store/translation/createActions';

class Translation extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    if (this.props.login) {
      return (
        <Fragment>
          <Helmet>
            <title>Translation Page</title>
            <meta charSet="utf-8"/>
            <meta name="my translation" content="react SSR的translation部分"/>
          </Helmet>
          <div>
            {
              this.props.translationList.map(item => <li key={item.id}>{item.title}</li>)
            }
          </div>
        </Fragment>
      );
    } else {
      return (<Redirect to="/"/>);
    }
  }
  
  componentDidMount () {
    this.props.propsGetTranslationList();
  }
  
}

const mapStateToProps = state => ({
  login: state.header.login,
  translationList: state.translation.translationList,
});

const mapDispatchToProps = dispatch => ({
  propsGetTranslationList() {
    dispatch(TranslationCreateActions.getTranslationList());
  }
});

const ExtraTranslation = connect(mapStateToProps, mapDispatchToProps)(Translation);

ExtraTranslation.loadData = store => {
  return store.dispatch(TranslationCreateActions.getTranslationList());
};

export default ExtraTranslation;
