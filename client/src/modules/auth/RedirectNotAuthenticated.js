import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { getUserFromCookie, remember } from './actions';

class RedirectNotAuthenticated extends Component {
  render() {
    const { to, children, history } = this.props;
    const current = history.location.pathname;
    const user = getUserFromCookie();
    if (user) return children;
    remember(current);
    return <Redirect to={to} />;
  }
}

export default withRouter(RedirectNotAuthenticated);
