const merge = require('lodash.merge');
const User = require('./user/resolvers');
const Role = require('./role/resolvers');
const Resource = require('./resource/resolvers');
const Hook = require('./hook/resolvers');
const Permission = require('./permission/resolvers');

let resolvers = {};
resolvers = merge(resolvers, Role);
resolvers = merge(resolvers, User);
resolvers = merge(resolvers, Resource);
resolvers = merge(resolvers, Hook);
resolvers = merge(resolvers, Permission);

module.exports = resolvers;