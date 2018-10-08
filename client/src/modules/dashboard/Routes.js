import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Dashboard from './Dashboard';

import RedirectNotAuthenticated from '../auth/RedirectNotAuthenticated';

class Routes extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to='/login'>
        <Route exact path="/" component={Dashboard} />
      </RedirectNotAuthenticated>
    );
  }
}

export default Routes;
