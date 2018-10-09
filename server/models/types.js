const Role = require('./role/types');
const User = require('./user/types');
const Resource = require('./resource/types');
const Hook = require('./hook/types');
const Permission = require('./permission/types');
const RoleHook = require('./rolehook/types');
const ResourceHook = require('./resourcehook/types');
const RoleUser = require('./roleuser/types');

const schema = {
  Role,
  User,
  Resource,
  Hook,
  Permission,
  RoleHook,
  ResourceHook,
  RoleUser
}

module.exports = schema;
