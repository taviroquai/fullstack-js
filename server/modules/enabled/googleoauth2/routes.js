const User = require('../user/User');
const { google } = require('googleapis');
const plus = google.plus('v1');
const errors = require('../../../core/errors.json');

/**
 * Init oauth2 client
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_SIGN_IN_CLIENT_ID,
  process.env.GOOGLE_SIGN_IN_SECRET,
  process.env.GOOGLE_SIGN_IN_REDIRECT
);
google.options({auth: oauth2Client});

// List supported apis
//const apis = google.getSupportedAPIs();
//console.log(apis);

let clientUrl = process.env.FSTACK_GOOGLEOAUTH2_LOGIN;
const sendMessage = (ctx, message) => {
  let encoded = Buffer.from(JSON.stringify(message)).toString('base64');
  ctx.redirect(clientUrl + '/' + encoded);
}

/*
 * Routes loader
 */
module.exports = (app, router) => {

  // Route to google auth2 
  router.get('/googleoauth2', async (ctx, next) => {

    // grab the url that will be used for authorization
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email'].join(' ')
    });

    // Return url
    ctx.set('Access-Control-Allow-Headers', 'content-type');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.body = url
  });

  // Route to google auth sample
  router.get('/googleoauth2done', async (ctx, next) => {
    const { tokens } = await oauth2Client.getToken(ctx.query.code);
    oauth2Client.credentials = tokens;

    // Get remote user info
    res = await plus.people.get({ userId: 'me' });
    let message = { error: null, user: null };

    // Validate remote user email
    if (res.data.emails.length === 0) {
      message.error = 'ERROR_INVALID_CREDENTIALS';
      return sendMessage(ctx, message);
    }

    // Get local user info from email if exists
    const email = res.data.emails[0].value;
    let user = await User.query().findOne({ email });

    /*
    // Invalidate user and return error message
    if (!user) {
      message.error = 'ERROR_INVALID_CREDENTIALS';
      return sendMessage(ctx, message);
    }
    */

    // Create user if not exists
    if (!user) {
      let data = { email, username: email, active: true };
      let result = await User.query().insert(data).returning('id');
      user = await User.query().findById(result.id);
    }

    // Validate user is active
    if (!user.active) {
      message.error = 'ERROR_ACCOUNT_IS_DISABLED';
      return sendMessage(ctx, message);
    }

    // Authenticate user
    user.authtoken = await user.regenerateJwt();
    delete user.password;

    // Return user with JWT token
    user.roles = await User.getRoles(user);
    message.user = user;
    sendMessage(ctx, message);
  });
}
