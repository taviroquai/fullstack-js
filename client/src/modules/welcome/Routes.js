import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Welcome from './Welcome';

import RedirectNotAuthenticated from '../auth/RedirectNotAuthenticated';

class Routes extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to='/login'>
        <Route exact path="/" component={Welcome} />
      </RedirectNotAuthenticated>
    );
  }
}

export default Routes;
