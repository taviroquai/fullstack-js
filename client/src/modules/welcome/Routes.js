import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Welcome from './Welcome';

class Routes extends Component {
  render() {
    return (
      <Route exact path="/" component={Welcome} />
    );
  }
}

export default Routes;
