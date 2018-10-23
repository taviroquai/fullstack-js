const errors = require('../../core/errors.json');

/**
 * Update authorization cache
 *
 * @param {Object} ctx
 * @param {String} type
 * @param {String} action
 * @param {Object} data
 */
const hook = async (ctx, resource, data) => {
  Authorization = require('../../core/Authorization');
  Authorization.updateCache();
  return data;
}

module.exports = hook;
