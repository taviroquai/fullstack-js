const Role = require('./role/types');
const User = require('./user/types');
const Resource = require('./resource/types');
const Hook = require('./hook/types');
const Permission = require('./permission/types');

const schema = {
  Role,
  User,
  Resource,
  Hook,
  Permission
}

module.exports = schema;