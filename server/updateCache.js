// Load enviroment variables
require('dotenv').config();

// Require dependencies
const ModuleManager = require('./core/ModuleManager');
const Authorization = require('./core/Authorization');
const GraphqlManager = require('./core/GraphqlManager');

// Update authorization cache
const updateCache = async () => {
  ModuleManager.updateCache();
  GraphqlManager.updateCache();
  await Authorization.updateCache();


  // Send some acknoledge output
  console.log('Cache updated!');
  process.exit(0);
}

// Start
updateCache();
