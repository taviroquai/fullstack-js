import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Profile from './Profile';
import LoginForm from './LoginForm';
import Logout from './Logout';
import RecoverForm from './RecoverForm';
import ResetPasswordForm from './ResetPasswordForm';

import RedirectNotAuthenticated from './RedirectNotAuthenticated';

const loginRedirect = process.env.REACT_APP_LOGIN_REDIRECT;
const logoutRedirect = process.env.REACT_APP_LOGOUT_REDIRECT;

class ProtectedRoutes extends Component {
  render() {
    return (
      <React.Fragment>

        <Route exact path="/auth/login" render={() =>
          <LoginForm redirect={loginRedirect} />
        } />
        <Route exact path="/auth/recover" component={RecoverForm} />
        <Route exact path="/auth/reset" component={ResetPasswordForm} />
      
        <RedirectNotAuthenticated to='/auth/login'>
          <Route exact path="/auth/profile" component={Profile} />
          <Route exact path="/auth/logout" render={() =>
            <Logout redirect={logoutRedirect} />
          } />
        </RedirectNotAuthenticated>
      </React.Fragment>
    );
  }
}

class Routes extends Component {
  render() {
    return (
      <Route path="/auth" component={ProtectedRoutes} />
    );
  }
}

export default Routes;
