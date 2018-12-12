import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SplashScreenExample from '../../share/SplashScreenExample';
import { logout } from './actions';
import RedirectNotAuthenticated from './RedirectNotAuthenticated';

class Logout extends Component {

  componentDidMount() {
    let { redirect, history } = this.props;
    redirect = redirect || '/auth/login';
    setTimeout(() => {
      logout(history, redirect);
    }, 1000);
  }

  render() {
    return <SplashScreenExample />;
  }
}

const LogoutWithDeps = withRouter(Logout);
const logoutRedirect = process.env.REACT_APP_LOGOUT_REDIRECT;
class SecuredLogout extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to="/auth/login">
        <LogoutWithDeps redirect={logoutRedirect} />
      </RedirectNotAuthenticated>
    )
  }
}

export default SecuredLogout;
