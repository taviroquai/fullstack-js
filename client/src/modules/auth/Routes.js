import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import LoginForm from './LoginForm';
import Logout from './Logout';
import RecoverForm from './RecoverForm';
import ResetPasswordForm from './ResetPasswordForm';

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/login" render={(props) => <LoginForm redirect="/" />} />
        <Route exact path="/logout" render={(props) => <Logout redirect="/login" />} />
        <Route exact path="/recover" component={RecoverForm} />
        <Route exact path="/reset" component={ResetPasswordForm} />
      </React.Fragment>
    );
  }
}

export default Routes;
