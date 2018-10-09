import { getModelList, getById, saveModel, put } from '../../../graphql';
import * as Queries from './queries';

/**
 * Get hooks list
 */
export const getHooks = () => {
  return getModelList(Queries, 'Hooks');
}

/**
 * Get hook by id
 * @param {Number} id
 */
export const getHookById = (id) => {
  return getById(Queries, 'getHookById', id);
}

/**
 * Save hook
 * @param {Object} hook
 */
export const saveHook = (hook) => {
  return saveModel(Queries, 'Hook', hook);
}

/**
 * Change resource hook
 * @param {Object} variables
 */
export const changeHookResource = (variables) => {
  return put(Queries.changeHookResource, 'changeHookResource', variables);
}

/**
 * Update role hook
 * @param {Object} variables
 */
export const updateRoleHook = (variables) => {
  return put(Queries.updateRoleHook, 'updateRoleHook', variables);
}
