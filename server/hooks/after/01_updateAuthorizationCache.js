const errors = require('../../core/errors.json');

/**
 * Update authorization cache
 *
 * @param {Object} ctx
 * @param {String} type
 * @param {String} action
 * @param {Object} data
 */
const hook = async (ctx, type, action, data) => {
  GraphqlAuthorization = require('../../core/GraphqlAuthorization');
  GraphqlAuthorization.updateCache();
  return data;
}

module.exports = hook;
