import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { isAuthenticated } from './actions';

class RedirectNotAuthenticated extends Component {

  render() {
    const { redirect, children } = this.props;
    const result = isAuthenticated();
    return result ? children : <Redirect to={redirect} />;
  }
}

export default withRouter(RedirectNotAuthenticated);
