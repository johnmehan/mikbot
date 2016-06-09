/**
 * This module is part of Telemetry test framework. It provides a REST API
 * to provision and verify data used for integration and functional tests.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , errorhandler = require('errorhandler')
  , logFactory = require('./controllers/logFactory');

var app = express();

// Read configuration settings
var env = app.get('env')
  , config = require('./config/restAPIConf')[env];

// Initialize logger
var logger = logFactory.initialize(config);

// TBD: Use DB cluster
mongoose.connect(config.dbUrl);

mongoose.connection.on('error', function(err) {
  console.log('ERROR: MongoDB - ' + err);
  throw new Error('MongoDB - ' + err);
});

//----- CONFIG -----

app.use(errorhandler());
app.use(morgan({
  stream: fs.createWriteStream(config.accesslogPath, {flags: 'a'})
}));

// Parses x-www-form-urlencoded requests
app.use(bodyParser());

// Allows for REST behavior
app.use(methodOverride());

var util = require('./controllers/util')
  , applicationDescriptor = require('./controllers/applicationDescriptors')
  , system = require('./controllers/system')
  , user = require('./controllers/users')
  , device = require('./controllers/devices');

//----- ROUTES -----

app.get('/status', util.status);
app.get('/version', util.version);

app.get('/applicationDescriptor', applicationDescriptor.get);
app.get('/applicationDescriptor/*', applicationDescriptor.get);
app.post('/applicationDescriptor', applicationDescriptor.create);
app.delete('/applicationDescriptor/:id', applicationDescriptor.remove);

app.get('/systemParameter', system.getSystemParameter);
app.get('/systemParameter/*', system.getSystemParameter);
app.post('/systemParameter', system.createSystemParameter);
app.delete('/systemParameter/:key', system.removeSystemParameter);

app.get('/serverKey', system.getServerKey);
app.post('/serverKey', system.createServerKey);
app.delete('/serverKey', system.removeServerKey);

app.get('/user', user.getUser);
app.get('/user/:id', user.getUser);
app.post('/user', user.createUser);
app.delete('/user/:id', user.removeUser);

app.get('/device', device.get);

//----- STARTUP -----

if (! module.parent) {
  app.listen(config.port);
  console.log('INFO: Test Service started on port ' + config.port);
  logger.info('Test Service listening on port ' + config.port);
}

