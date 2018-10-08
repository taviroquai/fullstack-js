import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import Dashboard from './dashboard/Dashboard';
import UsersList from './users/UsersList';
import UsersForm from './users/UsersForm';
import RolesList from './roles/RolesList';
import RolesForm from './roles/RolesForm';
import ResourcesList from './resources/ResourcesList';
import ResourcesForm from './resources/ResourcesForm';
import HooksList from './hooks/HooksList';
import HooksForm from './hooks/HooksForm';
import PermissionsList from './permissions/PermissionsList';
import PermissionsForm from './permissions/PermissionsForm';

import RedirectNotAuthenticated from './auth/RedirectNotAuthenticated';
import LoginForm from './auth/LoginForm';
import Logout from './auth/Logout';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <RedirectNotAuthenticated to='/login'>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/users" component={UsersList} />
              <Route path="/users/edit/:id?" component={UsersForm} />
              <Route exact path="/roles" component={RolesList} />
              <Route path="/roles/edit/:id?" component={RolesForm} />
              <Route exact path="/resources" component={ResourcesList} />
              <Route path="/resources/edit/:id?" component={ResourcesForm} />
              <Route exact path="/permissions" component={PermissionsList} />
              <Route path="/permissions/edit/:id?" component={PermissionsForm} />
              <Route exact path="/hooks" component={HooksList} />
              <Route path="/hooks/edit/:id?" component={HooksForm} />
            </RedirectNotAuthenticated>
          </Switch>
        </Router>
      </CookiesProvider>
    );
  }
}

export default App;
