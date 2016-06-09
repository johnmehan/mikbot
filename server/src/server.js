/**
 * Main server module.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var cluster = require('cluster');

if (cluster.isMaster) {
  for (var cpuCount = require('os').cpus().length; --cpuCount >= 0; ) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('WARN: Worker ' + worker.process.pid + ' died. Restarting ...');
    cluster.fork();
  });
} else {
//  require('nodetime').profile();
  var express = require('express')
    , mongoose = require('mongoose')
    , logFactory = require('./controllers/logFactory');

  var app = express();

  // Read configuration settings
  var env = app.get('env')
    , config = require('./config/serverConf')[env];

  // Initialize logger
  var logger = logFactory.initialize(config);

  // TBD: Use DB cluster
  mongoose.connect(config.dbUrl);

  mongoose.connection.on('error', function(err) {
    console.log('ERROR: MongoDB - ' + err);
    throw new Error('MongoDB - ' + err);
  });

  //----- CONFIG -----

  if (env == 'development') {
    var errorhandler = require('errorhandler');
    app.use(errorhandler());
  }

  app.disable('etag');

  var telemetry = require('./controllers/telemetry')
    , util = require('./controllers/util');

  //----- ROUTES -----

  app.post('/telemetry', telemetry.create);

  app.get('/status', util.status);
  app.get('/version', util.version);

  //----- STARTUP -----

  if (! module.parent) {
    app.listen(config.port);
    console.log('INFO: Server started on port ' + config.port);
    logger.info('Server listening on port ' + config.port);
  }
}

