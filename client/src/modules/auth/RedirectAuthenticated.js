import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { getUserFromCookie } from './actions';

class RedirectAuthenticated extends Component {
  render() {
    const { to, children, history } = this.props;
    const current = history.location.pathname;
    const user = getUserFromCookie();
    if (!user) return children;
    if (to === current) return null;
    return <Redirect to={to} />;
  }
}

export default withRouter(RedirectAuthenticated);
