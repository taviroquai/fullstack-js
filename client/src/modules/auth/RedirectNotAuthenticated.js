import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { isAuthenticated } from './actions';

class RedirectNotAuthenticated extends Component {

  render() {
    const { to, children, history } = this.props;
    const result = isAuthenticated();
    return result || (to === history.location.pathname) ?
      children :
      <Redirect to={to} />;
  }
}

export default withRouter(RedirectNotAuthenticated);
