const merge = require('lodash.merge');
const User = require('./user/resolvers');

let resolvers = {};
resolvers = merge(resolvers, User);

module.exports = resolvers;