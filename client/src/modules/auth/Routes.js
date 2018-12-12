import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Profile from './Profile';
import LoginForm from './LoginForm';
import Logout from './Logout';
import RecoverForm from './RecoverForm';
import ResetPasswordForm from './ResetPasswordForm';

class ProtectedRoutes extends Component {
  render() {
    return (
      <React.Fragment>

        <Route exact path="/auth/login" component={LoginForm} />
        <Route exact path="/auth/recover" component={RecoverForm} />
        <Route exact path="/auth/reset" component={ResetPasswordForm} />
        <Route exact path="/auth/profile" component={Profile} />
        <Route exact path="/auth/logout" component={Logout} />

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
