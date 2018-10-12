import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Demo from './Demo';
import RedirectNotAuthenticated from '../auth/RedirectNotAuthenticated';

class ProtectedComponent extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to='/login'>
        <Demo />
      </RedirectNotAuthenticated>
    );
  }
}

class Routes extends Component {
  render() {
    return (
      <Route exact path="/demo" component={ProtectedComponent} />
    );
  }
}

export default Routes;
