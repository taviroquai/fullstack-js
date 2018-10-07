import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import LoginForm from './auth/LoginForm';
import Logout from './auth/Logout';
import UsersList from './users/UsersList';
import UsersForm from './users/UsersForm';
import RolesList from './roles/RolesList';
import RolesForm from './roles/RolesForm';
import RedirectNotAuthenticated from './auth/RedirectNotAuthenticated';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <RedirectNotAuthenticated to='/login'>
              <Route exact path="/" component={UsersList} />
              <Route path="/users/edit/:id?" component={UsersForm} />
              <Route exact path="/roles" component={RolesList} />
              <Route path="/roles/edit/:id?" component={RolesForm} />
            </RedirectNotAuthenticated>
          </Switch>
        </Router>
      </CookiesProvider>
    );
  }
}

export default App;
