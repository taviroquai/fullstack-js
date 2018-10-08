import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import LoginForm from './LoginForm';
import Logout from './Logout';

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        <Route path="/login" render={(props) => <LoginForm redirect="/" />} />
        <Route path="/logout" render={(props) => <Logout redirect="/login" />} />
      </React.Fragment>
    );
  }
}

export default Routes;
