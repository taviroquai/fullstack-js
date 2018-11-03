import Store from 'react-observable-store';
import { getUserFromCookie } from '../auth/actions';

const endpoint = process.env.REACT_APP_SERVER_URL;

export const load = async () => {
  return new Promise(resolve => {
    fetch(endpoint + '/authorization')
    .then(r => r.json())
    .then(data => {
      resolve(data);
    });
  })
}

export const allowed = (resource) => {
  const user = getUserFromCookie();
  const roleIds = user.roles.map(r => parseInt(r.role_id, 10));
  const permissions = Store.get('system.authorization.permissions');
  if (!permissions) return false;
  const access = permissions.reduce((access, p) => {
    if (p.resource === resource && roleIds.indexOf(p.role_id) > -1) {
      access = access && p.access;
    }
    return access;
  }, true);
  return access;
}

export const denied = (resource) => !allowed(resource);
