import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SplashScreen from '../SplashScreen';
import { logout } from './actions';

class Logout extends Component {

  componentDidMount() {
    logout().then(() => {
      const { history } = this.props;
      history.push('/login');
    })
  }

  render() {
    return <SplashScreen />;
  }
}

export default withRouter(Logout);
