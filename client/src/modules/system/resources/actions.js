import { getModelList, getById, saveModel, get, put } from '../../../graphql';
import * as Queries from './queries';

/**
 * Get resources list
 */
export const getResources = (params) => {
  return getModelList(Queries, 'Resources', params);
}

/**
 * Get resource by id
 * @param {Number} id
 */
export const getResourceById = (id) => {
  return getById(Queries, 'getResourceById', id);
}

/**
 * Save resource
 * @param {Object} resource
 */
export const saveResource = (resource) => {
  return saveModel(Queries, 'Resource', resource);
}

/**
 * Get hooks that belongs to resource
 * @param {Object} variables
 */
export const getResourceHooks = (variables) => {
  return get(Queries.getResourceHooks, 'getResourceHooks', variables);
}

/**
 * Update resource hook
 * @param {Object} variables
 */
export const updateResourceHook = (variables) => {
  return put(Queries.updateResourceHook, 'updateResourceHook', variables);
}
