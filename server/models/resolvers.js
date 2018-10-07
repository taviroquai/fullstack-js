const merge = require('lodash.merge');
const User = require('./user/resolvers');
const Role = require('./role/resolvers');

let resolvers = {};
resolvers = merge(resolvers, Role);
resolvers = merge(resolvers, User);

module.exports = resolvers;