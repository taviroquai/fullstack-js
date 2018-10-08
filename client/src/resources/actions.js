import { getModelList, getById, saveModel } from '../graphql';
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
 * @param {String} id 
 */
export const getResourceHooks = (id) => {
  return getById(Queries, 'getResourceHooks', id);
}
