import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import LoginForm from './auth/LoginForm';
import UsersList from './users/List';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <Route path="/login" component={LoginForm} />
            <Route path="/" component={UsersList} />
          </Switch>
        </Router>
      </CookiesProvider>
    );
  }
}

export default App;
