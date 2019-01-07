// Load enviroment variables
require('dotenv').config();

// Require dependencies
const Framework = require('./core/Framework');
const fw = new Framework();

// Update authorization cache
const updateCache = async () => {
  fw.getModuleManager().updateCache();
  fw.getGraphqlManager().updateCache();
  await fw.getAuthorization().updateCache();


  // Send some acknoledge output
  console.log('Cache updated!');
  process.exit(0);
}

// Start
updateCache();
