import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { isAuthenticated } from './actions';
import SplashScreenExample from '../../share/SplashScreenExample';

class RedirectNotAuthenticated extends Component {

  state = { loading: true, result: false }

  componentDidMount() {
    isAuthenticated().then(result => {
      this.setState({
        loading: false,
        result
      });
    });
  }

  render() {
    const { to, children, history } = this.props;
    const { loading, result } = this.state;
    if (loading) return <SplashScreenExample />;
    return result || (to === history.location.pathname) ?
      children :
      <Redirect to={to} />;
  }
}

export default withRouter(RedirectNotAuthenticated);
