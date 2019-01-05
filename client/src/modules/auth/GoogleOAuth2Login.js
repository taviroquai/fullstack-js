import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import SplashScreenExample from '../../share/SplashScreenExample';
import { loginUser } from './actions';

class GoogleOAuth2Login extends Component {

  state = {
    error: ''
  }

  componentDidMount() {
    let { history, match } = this.props;
    const message = JSON.parse(atob(match.params.message));

    // Validate message
    if (message.error) {
      this.setState({ error: message.error });
    } else {
      loginUser(message.user, () => {
        history.push('/demo')
      });
    }
  }

  render() {
    const { error } = this.state;
    return <SplashScreenExample error={error} />;
  }
}

export default withRouter(GoogleOAuth2Login);
