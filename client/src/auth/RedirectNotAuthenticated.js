import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { isAuthenticated } from './actions';

class RedirectNotAuthenticated extends Component {

  render() {
    const { to, children } = this.props;
    const result = isAuthenticated();
    return result ? children : <Redirect to={to} />;
  }
}

export default withRouter(RedirectNotAuthenticated);
