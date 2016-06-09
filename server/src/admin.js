/**
 * Main admin module.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , http = require('http')
  , https = require('https')
  , morgan = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , expressSession = require('express-session')
  , fs = require('fs')
  , flash = require('connect-flash')
  , passport = require('passport')
  , logFactory = require('./controllers/logFactory');

var app = express();

// Read configuration settings
var env = app.get('env')
  , config = require('./config/adminConf')[env];

// Initialize logger
var logger = logFactory.initialize(config);

// TBD: Use DB cluster
mongoose.connect(config.dbUrl);

mongoose.connection.on('error', function(err) {
  console.log('ERROR: MongoDB - ' + err);
  throw new Error('MongoDB - ' + err);
});

require('./controllers/passport')(passport);

var util = require('./controllers/util')
  , users = require('./controllers/users')
  , system = require('./controllers/system')
  , appDescriptors = require('./controllers/applicationDescriptors')
  , controls = require('./controllers/controls')
  , devices = require('./controllers/devices');

//----- CONFIG -----

app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(express.static(__dirname + '/public'));

app.use(morgan({
  stream: fs.createWriteStream(config.accesslogPath, {flags: 'a'})
}));

if (env == 'development') {
  var errorhandler = require('errorhandler');
  app.use(errorhandler());
}

app.use(cookieParser());

// Parses x-www-form-urlencoded requests
app.use(bodyParser());

// Allows for REST behavior
app.use(methodOverride());

app.use(expressSession({secret: 'iR!d3T01'}));

// Setup flash messages
app.use(flash());

// Setup passport session
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  res.locals.currentURL = req.url;
  res.locals.sessionUser = req.user ? req.user.username : '';
  next();
});

//----- ROUTES -----

app.get('/admin', function(req, res) {
  res.render('admin-login.jade', {version: util.appVersion});
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/admin', failureFlash: 'Invalid credentials'}), function(req, res) {
  res.redirect('/tab/apps');
});

app.get('/logout', users.checkAuth, function(req, res) {
  req.logout();
  res.redirect('/admin');
});

app.get('/admin-help', users.checkAuth, function(req, res) {
  res.render('admin-help.jade');
});

app.get('/tab/apps', users.checkAuth, appDescriptors.render);

app.get('/tab/controls', users.checkAuth, controls.render);

app.get('/controls/*', users.checkAuth, controls.processArrow);

app.post('tabs/controls/connect', users.checkAuth, controls.connect);

app.post('tabs/controls/disconnect', users.checkAuth, controls.disconnect);

app.get('/tab/server', users.checkAuth, system.render);

app.get('/tab/reports', users.checkAuth, function(req, res) {
  res.render('admin-reports.jade');
});

app.get('/tab/auth', users.checkAuth, function(req, res) {
  res.render('admin-auth.jade');
});

app.get('/tab/apps/appDescriptors/new', users.checkAuth, appDescriptors.render);

app.post('/appDescriptors', users.checkAuth, appDescriptors.renderAdd);

app.get('/tab/apps/appDescriptors/:id', users.checkAuth, appDescriptors.render);

app.post('/appDescriptors/:id', users.checkAuth, appDescriptors.renderUpdate);

app.get('/appDescriptors/:id', users.checkAuth, appDescriptors.renderDelete);

app.post('/server/key', users.checkAuth, system.renderServerKeyUpdate);

app.post('/server/parameters', users.checkAuth, system.renderParametersUpdate);

app.post('/auth/password', users.checkAuth, users.renderPasswordUpdate);


app.get('/report/devicelist', users.checkAuth, function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods','GET');
  res.render('admin-reports-devicelist.jade', {
    restURL: '/device?output=google'
  });
});

app.get('/report/devicelist-cntrl', users.checkAuth, function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods','GET');
  res.render('admin-reports-devicelist-cntrl.jade', {
    restURL: '/device?output=google'
  });
});

app.get('/report/jailbreak', users.checkAuth, function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods','GET');
  res.render('admin-reports-jailbreak.jade', {
    restURL: '/device?output=google'
  });
});

// Moved from server
app.get('/applicationDescriptor/*', appDescriptors.get);
app.post('/applicationDescriptor', appDescriptors.create);
app.get('/device', devices.get);

//----- STARTUP -----

if (! module.parent) {
  var server
    , port;

  if (config.sslEnabled === true) {
    server = https.createServer({
      key: fs.readFileSync(config.sslKeyPath),
      cert: fs.readFileSync(config.sslCertificatePath)
    }, app);
    port = config.sslPort;
  } else {
    server = http.createServer(app);
    port = config.port;
  }

  server.listen(port, function() {
    console.log('INFO: Admin GUI started on port ' + port);
    logger.info('Admin GUI listening on port ' + port);
  });
}

