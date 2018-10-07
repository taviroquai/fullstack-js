import { getModelList, getModelById, saveModel } from '../graphql';
import * as Queries from './queries';

/**
 * Get roles list
 */
export const getRoles = () => {
  return getModelList(Queries, 'Roles');
}

/**
 * Get role by id
 * @param {Number} id 
 */
export const getRoleById = (id) => {
  return getModelById(Queries, 'Role', id);
}

/**
 * Save role
 * @param {Object} role 
 */
export const saveRole = (role) => {
  return saveModel(Queries, 'Role', role);
}
