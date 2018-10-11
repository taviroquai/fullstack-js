import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SplashScreenExample from '../../share/SplashScreenExample';
import { logout } from './actions';

class Logout extends Component {

  componentDidMount() {
    let { redirect, history } = this.props;
    redirect = redirect || '/login';
    setTimeout(() => {
      logout(history, redirect);
    }, 1000);
  }

  render() {
    return <SplashScreenExample />;
  }
}

export default withRouter(Logout);
