import { get, put } from '../../../graphql';
import * as Queries from './queries';

/**
 * Get resources list
 */
export const getResources = (variables) => {
  return get(Queries.getResources, 'getResources', variables);
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
