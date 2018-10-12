import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import LoginForm from './LoginForm';
import Logout from './Logout';
import RecoverForm from './RecoverForm';
import ResetPasswordForm from './ResetPasswordForm';

const loginRedirect = process.env.REACT_APP_LOGIN_REDIRECT;
const logoutRedirect = process.env.REACT_APP_LOGOUT_REDIRECT;

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/login" render={() =>
          <LoginForm redirect={loginRedirect} />
        } />
        <Route exact path="/logout" render={() =>
          <Logout redirect={logoutRedirect} />
        } />
        <Route exact path="/recover" component={RecoverForm} />
        <Route exact path="/reset" component={ResetPasswordForm} />
      </React.Fragment>
    );
  }
}

export default Routes;
