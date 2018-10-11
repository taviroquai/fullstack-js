import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Welcome from './Welcome';
import RedirectNotAuthenticated from '../auth/RedirectNotAuthenticated';

class ProtectedComponent extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to='/login'>
        <Welcome />
      </RedirectNotAuthenticated>
    );
  }
}

class Routes extends Component {
  render() {
    return (
      <Route exact path="/" component={ProtectedComponent} />
    );
  }
}

export default Routes;
