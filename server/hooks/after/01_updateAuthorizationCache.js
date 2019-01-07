const errors = use('core/errors.json');

/**
 * Update authorization cache
 *
 * @param {Object} ctx
 * @param {String} type
 * @param {String} action
 * @param {Object} data
 */
const hook = async (ctx, resource, data) => {
  Authorization = use('core/Authorization');
  Authorization.updateCache();
  return data;
}

module.exports = hook;
