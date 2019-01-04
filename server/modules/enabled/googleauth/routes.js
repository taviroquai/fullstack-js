const User = require('../user/User');
const {google} = require('googleapis');
const plus = google.plus('v1');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_SIGN_IN_CLIENT_ID,
  process.env.GOOGLE_SIGN_IN_SECRET,
  process.env.GOOGLE_SIGN_IN_REDIRECT
);
google.options({auth: oauth2Client});

/*
 * Routes loader
 */
module.exports = (app, router) => {

  // Route to google auth2 
  router.get('/googleauth2', async (ctx, next) => {

    // grab the url that will be used for authorization
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email'].join(' ')
    });

    // Display login form
    ctx.body = '<a href="' + url + '">link</a>';
  });

  // Route to google auth sample
  router.get('/googleauth2done', async (ctx, next) => {
    const {tokens} = await oauth2Client.getToken(ctx.query.code);
    oauth2Client.credentials = tokens;

    // List supported apis
    //const apis = google.getSupportedAPIs();
    //console.log(apis);

    // Get remote user info
    res = await plus.people.get({userId: 'me'});

    // Get local user info from email if exists
    if (res.data.emails.length) {
      let email = res.data.emails[0].value;
      let user = await User.getUserFromEmail(email);
      console.log(user);
      
      // Create/Register user?
      //if (!user) {}
    } else {
      // Invalid user? 
    }
    
    // Return user
    ctx.body = res.data;
  });
}
