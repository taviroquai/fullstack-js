import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { getUserFromCookie } from './actions';

class RedirectAuthenticated extends Component {
  render() {
    const { to, children } = this.props;
    const user = getUserFromCookie();
    if (!user) return children;
    return <Redirect to={to} />;
  }
}

export default withRouter(RedirectAuthenticated);
