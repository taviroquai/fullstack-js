import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Demo from './Demo';

class Routes extends Component {
  render() {
    return (
      <Route exact path="/demo" component={Demo} />
    );
  }
}

export default Routes;
