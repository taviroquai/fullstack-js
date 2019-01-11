import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import UsersList from './users/UsersList';
import UsersForm from './users/UsersForm';
import RolesList from './roles/RolesList';
import RolesForm from './roles/RolesForm';
import ResourcesList from './resources/ResourcesList';
import ResourcesForm from './resources/ResourcesForm';

import Store from 'react-observable-store';

Store.add('system', {
  system: {
    authorization: null
  }
});

class ProtectedRoutes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/system/users" component={UsersList} />
        <Route path="/system/users/edit/:id?" component={UsersForm} />
        <Route exact path="/system/roles" component={RolesList} />
        <Route path="/system/roles/edit/:id?" component={RolesForm} />
        <Route exact path="/system/resources" component={ResourcesList} />
        <Route path="/system/resources/edit/:id?" component={ResourcesForm} />
      </Switch>
    );
  }
}

class Routes extends Component {
  render() {
    return (
      <Route path="/system" component={ProtectedRoutes} />
    );
  }
}

export default Routes;
