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
 * Change hook
 * @param {Object} Queries
 * @param {String} modelName
 * @param {Object} model
 */
export const changeHookResource = (variables) => {
  return put(Queries.changeHookResource, 'changeHookResource', variables);
}
