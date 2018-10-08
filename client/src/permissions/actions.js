import { getModelList, getById, saveModel } from '../graphql';
import * as Queries from './queries';

/**
 * Get permissions list
 */
export const getPermissions = () => {
  return getModelList(Queries, 'Permissions');
}

/**
 * Get permission by id
 * @param {Number} id 
 */
export const getPermissionById = (id) => {
  return getById(Queries, 'getPermissionById', id);
}

/**
 * Save permission
 * @param {Object} permission 
 */
export const savePermission = (permission) => {
  return saveModel(Queries, 'Permission', permission);
}

/**
 * Get users that belongs to permission
 * @param {String} id 
 */
export const getPermissionUsers = (id) => {
  return getById(Queries, 'getPermissionUsers', id);
}
