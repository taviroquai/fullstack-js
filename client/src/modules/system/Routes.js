import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import UsersList from './users/UsersList';
import UsersForm from './users/UsersForm';
import RolesList from './roles/RolesList';
import RolesForm from './roles/RolesForm';
import ResourcesList from './resources/ResourcesList';
import ResourcesForm from './resources/ResourcesForm';
import PermissionsList from './permissions/PermissionsList';
import PermissionsForm from './permissions/PermissionsForm';

import RedirectNotAuthenticated from '../auth/RedirectNotAuthenticated';

class App extends Component {
  render() {
    return (
      <RedirectNotAuthenticated to='/login'>
        <Route exact path="/users" component={UsersList} />
        <Route path="/users/edit/:id?" component={UsersForm} />
        <Route exact path="/roles" component={RolesList} />
        <Route path="/roles/edit/:id?" component={RolesForm} />
        <Route exact path="/resources" component={ResourcesList} />
        <Route path="/resources/edit/:id?" component={ResourcesForm} />
        <Route exact path="/permissions" component={PermissionsList} />
        <Route path="/permissions/edit/:id?" component={PermissionsForm} />
      </RedirectNotAuthenticated>
    );
  }
}

export default App;
