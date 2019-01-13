const { google } = require('googleapis');

/**
 * Init oauth2 client
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_SIGN_IN_CLIENT_ID,
  process.env.GOOGLE_SIGN_IN_SECRET,
  process.env.GOOGLE_SIGN_IN_REDIRECT
);

// List supported apis
//const apis = google.getSupportedAPIs();
//console.log(apis);

module.exports = { 
  google,
  oauth2Client
}