/**
 * Business logic for managing System settings.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var url = require('url')
  , util = require('./util');

require('../models/system');

var logger = require('./logFactory').getLogger();

/**
 * System parameter keys and their default values (persisted in DB).
 *
 * To retrieve a system parameter's value:
 *   var sys = require('./controllers/system');
 *   ...
 *   var parmVal = sys.getParameter(sys.ParameterKey.NonceRangeMilliseconds);
 *
 * NOTE: System parameters are cached in RAM during startup for fast retrieval.
 * Thus, a system restart is required for changes to system parameters to take
 * effect.
 */
var sysParmsDefault = {
  NonceRangeMilliseconds: 100000000000
};
exports.ParameterKey = ParameterKey = {};
for (var parmKey in sysParmsDefault) {
  ParameterKey[parmKey] = parmKey;
}

/**
 * During startup:
 * 1. Existing system parameters are read from DB.
 * 2. New system parameters are added to DB.
 * 3. All system parameters are cached in RAM.
 */
var sysParms;
SystemParameter.find({}, function(err, result) {
  if (err)  util.handleError(err);

  sysParms = result;

  for (var parmKey in sysParmsDefault) {
    if (! result.some(function(e) { return (e.key === parmKey); })) {
      var sysParm = new SystemParameter({
        key: parmKey,
        value: sysParmsDefault[parmKey]
      });

      sysParm.save(function(err) {
        if (err && err.code != 11000)  util.handleError(err);
      });

      sysParms.push(sysParm);
    }
  }
});

exports.getParameter = function(parmKey) {
  for (var i = sysParms.length; --i >= 0; ) {
    if (sysParms[i].key === parmKey)  return sysParms[i].value;
  }
};

exports.render = function(req, res) {
  ServerKey.findOne({}, function(err, serverKeyUpdated) {
    if (err)  util.renderError(req, 'Failed to load Server Private-Key', err);

    var options = {
      serverKeyUpdated: (serverKeyUpdated
                         ? util.dateToString(serverKeyUpdated.updateDate) :
                         'Never updated')
    };

    SystemParameter.find({}, function(err, result) {
      if (err)  util.renderError(req, 'Failed to load System Parameters', err);

      res.render('admin-server.jade', util.merge(options, {sysParms: result}));
    });
  });
};

exports.renderServerKeyUpdate = function(req, res) {
  ServerKey.findOne({}, function(err, result) {
    if (err) {
      util.renderError(req, 'Failed to load Server Private-Key', err);
      res.redirect('/tab/server');
    } else {
      if (! result)  result = new ServerKey();

      result.privateKey = new Buffer(req.body.privateKey, 'base64');
      result.updateDate = Date.now();

      result.save(function(err) {
        if (err) {
          util.renderError(req, 'Failed to save Server Private-Key', err);
        } else util.renderInfo(req, 'Server Private-Key was updated');

        res.redirect('/tab/server');
      });
    }
  });
};

exports.renderParametersUpdate = function(req, res) {
  SystemParameter.find({}, function(err, result) {
    if (err) {
      util.renderError(req, 'Failed to load System Parameters', err);
    } else {
      var sysParmsMap = [];

      for (var i = result.length;
            --i >= 0;
            sysParmsMap[result[i].key] = result[i]);

      var sysParmsObj = req.body;

      for (var parmKey in sysParmsObj) {
        var sysParm = sysParmsMap[parmKey];

        if (sysParm.value !== sysParmsObj[parmKey]) {
          sysParm.value = sysParmsObj[parmKey];

          sysParm.save(function(err) {
            if (err) {
              util.renderError(req, 'Failed to save System Parameter: '
                               + parmKey + '=' + sysParm.value, err);
            } else {
              logger.info('Updated System Parameter: '
                          + parmKey + '=' + sysParm.value);
            }
          });
        }
      }

      util.renderInfo(req, 'System Parameters were updated');
    }

    res.redirect('/tab/server');
  });
};

/**
 * Processes the following request:
 * - URL:
 *     /systemParameter
 * - Method:
 *     POST
 * - Request body ("Content-Type"="text/plain"):
 *     {"key":"loglevel","value":"info"}
 */
exports.createSystemParameter = function(req, res) {
  var data = '';

  req.on('data', function(chunk) {
    // Check upper limit, in case of DOS attack using message overflow
    if (data.length > 500) {
      return new Error('Message too big');
    }

    data += chunk;
  });

  req.on('end', function() {
    var systemData;

    try {
      systemData = JSON.parse(data);
    } catch (ex) {
      logger.error('Failed to parse request data: ' + ex);
      res.statusCode = 500;
      res.send('Error: ' + ex);
      return;
    }

    var systemParameter = new SystemParameter(systemData);

    systemParameter.save(function(err) {
      if (err) {
        logger.error('Failed to save System Paramater: ' + err);
        res.statusCode = 500;
        res.send('Error: ' + err);
      } else {
        res.send(data);
      }
    });
  });

  req.on('error', function(ex) {
    res.statusCode = 500;
    res.send('Error: ' + ex);
  });
};

/**
 * Processes the following request:
 * Delete  result
 * - URL:  /applicationDescriptor/{key}
 * - Method:  DELETE
 */
exports.removeSystemParameter = function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;
  logger.info('system.removeSystemParameter called, pathname: ' + pathname);

  req.on('end', function() {
    logger.info('system.removeSystemParameter end triggered');
    var keyParam = req.params.key;
    logger.info('system.removeSystemParameter key: ' + keyParam);
    SystemParameter.remove({key: keyParam}, function(err, systemParam) {
        if (err) {
            logger.error('Failed to delete System parameter: ' + err);
            res.statusCode = 500;
            res.send('Error: ' + err);
        } else if (! systemParam) {
             res.statusCode = 404;
             res.send('Not found');
        } else {
          res.send("Deleted system parameter: " + keyParam);
        }
    });
  });

  req.on('error', function(ex) {
    res.statusCode = 500;
    res.send('Error: ' + ex);
  });
  req.resume();
};

/**
 * Processes the following request:
 * Get 1 result
 * - URL:  /systemParameter/{key}
 * OR list all
 * - URL: /systemParameter
 * - Method:  GET
 */
exports.getSystemParameter = function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;

  logger.info('system.getSystemParameter called, pathname: ' + pathname);

  req.on('end', function() {
    logger.info('system.getSystemParameter end triggered');
    var keyParam = pathname.split('/').pop();
    logger.info('system.getSystemParameter key: ' + keyParam);
    if ( keyParam != null && keyParam != 'systemParameter') {
        SystemParameter.findOne({key: keyParam}, function(err, systemParam) {
            if (err) {
                logger.error('Failed to load Application Descriptor: ' + err);
                res.statusCode = 500;
                res.send('Error: ' + err);
            } else if (! systemParam) {
                 res.statusCode = 404;
                 res.send('Not found');
            } else {
              res.send(JSON.stringify(systemParam));
            }
        });
    } else {
        logger.info('system.getSystemParameter key: null');
        SystemParameter.find({},function(err, systemParameters) {
            if (err) {
                logger.error('Failed to load System Parameter: ' + err);
                res.statusCode = 500;
                res.send('Error: ' + err);
            } else if (! systemParameters) {
                res.statusCode = 404;
                res.send('Not found');
            } else {
                res.send(JSON.stringify(systemParameters));
            }
        });
     }
  });

  req.on('error', function(ex) {
    res.statusCode = 500;
    res.send('Error: ' + ex);
  });
  req.resume();
};

/**
 * Processes the following request:
 * Get server key result
 * - URL:  /serverKey
 */
exports.getServerKey = function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;

  logger.info('system.getServerKey called, pathname: ' + pathname);

  req.on('end', function() {
    logger.info('system.getServerKey end triggered');
//    var keyParam = pathname.split('/').pop();

    ServerKey.find({},function(err, systemParameters) {
        if (err) {
            logger.error('Failed to load Server Key: ' + err);
            res.statusCode = 500;
            res.send('Error: ' + err);
        } else if (! systemParameters) {
            res.statusCode = 404;
            res.send('Not found');
        } else if (! systemParameters.length > 1) {
            res.statusCode = 500;
            res.send('Configuration error, more than 1 server key in DB');
        } else {
            logger.info('system.getServerKey: ' + systemParameters);
            logger.info('system.getServerKey privateKey: ' + systemParameters.privateKey);
            res.send(JSON.stringify(systemParameters));
        }
    });

  });

  req.on('error', function(ex) {
    res.statusCode = 500;
    res.send('Error: ' + ex);
  });
  req.resume();
};

/**
 * Processes the following request:
 * Delete server key (there should only be 1 record)
 * - URL:  /serverKey
 * - Method:  DELETE
 */
exports.removeServerKey = function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;
  logger.info('system.removeServerKey called, pathname: ' + pathname);

  req.on('end', function() {
    logger.info('system.removeServerKey end triggered');
    var keyParam = req.params.key;
    logger.info('system.removeServerKey key: ' + keyParam);
    ServerKey.remove({}, function(err, systemParam) {
        if (err) {
            logger.error('Failed to delete Server Key: ' + err);
            res.statusCode = 500;
            res.send('Error: ' + err);
        } else if (! systemParam) {
             res.statusCode = 404;
             res.send('Not found');
        } else {
          res.send("deleted server key ");
        }
    });
  });
  req.resume();
};

/**
 * Processes the following request:
 * Create server key
 * - URL:  /serverKey
 *   Body: 32 byte base64 encoded key
 * - Method:  POST
 *
 Example for key: 12345678901234567890123456789012

 URL: http://localhost:7777/serverKey
 Headers:
 Body: MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=
 */
exports.createServerKey = function(req, res) {
  var data = [];

  req.setEncoding(null);

  req.on('data', function(chunk) {
    data += chunk;

    logger.info('system.createServerKey Read server key length: ' + data.length);
    logger.info('system.createServerKey Read server key Base64-data: ' + data.toString());
  });

  req.on('end', function() {
    var serverKey = new ServerKey();

    serverKey.privateKey = new Buffer(data.toString(), 'base64');

    serverKey.save(function(err) {
      if (err) {
        logger.error('Failed to save Server Key: ' + err);
        res.statusCode = 500;
        res.send('Error: ' + err);
      } else {
        res.send("Server Key saved");
      }
    });
  });

  req.on('error', function(ex) {
    res.statusCode = 500;
    res.send('system.createServerKey Error: ' + ex);
  });
};

