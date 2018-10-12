import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { getUserFromCookie } from './actions';

class RedirectNotAuthenticated extends Component {
  render() {
    const { to, children, history } = this.props;
    const user = getUserFromCookie();
    console.log('redirect');
    if (user || (to === history.location.pathname)) return children;
    return <Redirect to={to} />;
  }
}

export default withRouter(RedirectNotAuthenticated);
