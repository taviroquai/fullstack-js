const merge = require('lodash.merge');
const User = require('./user/resolvers');
const Role = require('./role/resolvers');
const Resource = require('./resource/resolvers');
const Hook = require('./hook/resolvers');
const Permission = require('./permission/resolvers');
const RoleHook = require('./rolehook/resolvers');
const ResourceHook = require('./resourcehook/resolvers');
const RoleUser = require('./roleuser/resolvers');

let resolvers = {};
resolvers = merge(resolvers, Role);
resolvers = merge(resolvers, User);
resolvers = merge(resolvers, Resource);
resolvers = merge(resolvers, Hook);
resolvers = merge(resolvers, Permission);
resolvers = merge(resolvers, RoleHook);
resolvers = merge(resolvers, ResourceHook);
resolvers = merge(resolvers, RoleUser);

module.exports = resolvers;
