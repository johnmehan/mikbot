/**
 * Business logic for managing Application Descriptors.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var url = require('url')
  , util = require('./util');

require('../models/applicationDescriptor');

var logger = require('./logFactory').getLogger();

/**
 * Processes the following request:
 * - URL:
 *     /applicationDescriptor
 * - Method:
 *     POST
 * - Request body ("Content-Type"="text/plain"):
 *     {"applicationID":3,"description":"TestApp","publicKey":"dummyKey","enabled":true}
 */
exports.create = function(req, res) {
  var data = '';

  req.on('data', function(chunk) {
    // Check upper limit, in case of DOS attack using message overflow
    if (data.length > 500) {
      return new Error('Message too big');
    }

    data += chunk;
  });

  req.on('end', function() {
    var applicationDescriptorData;

    try {
      applicationDescriptorData = JSON.parse(data);
    } catch (ex) {
      logger.error('Failed to parse request data: ' + ex);
      res.statusCode = 500;
      res.send('Error: ' + ex);
      return;
    }

    var applicationDescriptor = new ApplicationDescriptor(applicationDescriptorData);

    applicationDescriptor.save(function(err) {
      if (err) {
        logger.error('Failed to save Application Descriptor: ' + err);
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
 * - URL:  /applicationDescriptor/{applicationID}
 * - Method:  DELETE
 */
exports.remove = function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;
  logger.info('applicationdesriptor.delete called, pathname:' + pathname);


  req.on('end', function() {
    logger.info('applicationdesriptor.delete end triggered');
    var appID = req.params.id;
    logger.info('applicationdesriptor.get appID:' + appID);
    ApplicationDescriptor.remove({applicationID: appID}, function(err, appDesc) {
        if (err) {
            logger.error('Failed to delete Application Descriptor: ' + err);
            res.statusCode = 500;
            res.send('Error: ' + err);
        } else if (! appDesc) {
             res.statusCode = 404;
             res.send('Not found');
        } else {
          res.send('Deleted Application Descriptor: ' + appID);
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
 * - URL:  /applicationDescriptor/{applicationID}
 * OR list all
 * - URL: /applicationDescriptor
 * - Method:  GET
 */
exports.get = function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;
  logger.info('applicationdesriptor.get called, pathname:' + pathname);


  req.on('end', function() {
    logger.info('applicationdesriptor.get end triggered');
    var appID = pathname.split('/').pop();
    logger.info('applicationdesriptor.get appID:' + appID);
    if (appID != null && appID != 'applicationDescriptor') {
      ApplicationDescriptor.findOne({applicationID: appID}, function(err, appDesc) {
        if (err) {
          logger.error('Failed to load Application Descriptor: ' + err);
          res.statusCode = 500;
          res.send('Error: ' + err);
        } else if (! appDesc) {
           res.statusCode = 404;
           res.send('Not found');
        } else {
          res.send(JSON.stringify(appDesc));
        }
      });
    } else {
        logger.info('applicationdesriptor.get appID: null');
        ApplicationDescriptor.find({},function(err, applicationdecsriptors) {
          if (err) {
            logger.error('Failed to load Application Descriptors: ' + err);
            res.statusCode = 500;
            res.send('Error: ' + err);
          } else if (! applicationdecsriptors) {
            res.statusCode = 404;
            res.send('Not found');
          } else {
            res.send(JSON.stringify(applicationdecsriptors));
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

exports.render = function(req, res) {
  ApplicationDescriptor.find({}, function(err, appDescriptors) {
    if (err) {
      util.renderError(req, 'Failed to load Application Descriptors', err);
    }

    var options = {appDescriptors: appDescriptors};

    if (req.params.id) {
      ApplicationDescriptor.findOne({applicationID: req.params.id}, function(err, appDescriptor) {
        if (err) {
          util.renderError(req, 'Failed to load Application Descriptor ' + req.params.id, err);
        }

        if (! appDescriptor) {
          util.renderError(req, 'Failed to find Application Descriptor ' + req.params.id, err);
          res.redirect('/tab/apps/');
        } else {
          util.merge(options, {context: appDescriptor});
          res.render('admin-apps.jade', options);
        }
      });
    } else res.render('admin-apps.jade',
              (req.url === '/tab/apps/appDescriptors/new'
               ? util.merge(options, {context: 'new'}) : options));
  });
};

exports.renderAdd = function(req, res) {
  var appDescriptor = new ApplicationDescriptor({
    applicationID: req.body.id
    , description: req.body.description
    , enabled: (req.body.enabled ? true : false)
    , publicKey: req.body.publicKey
  });

  appDescriptor.save(function(err) {
    if (err) {
      if (err.code == 11000) {
        util.renderError(req, 'Failed to add Application Descriptor with duplicate Application ID');
      } else {
        util.renderError(req, 'Failed to add Application Descriptor', err);
      }
    } else util.renderInfo(req, 'Application Descriptor was added');

    res.redirect('/tab/apps');
  });
};

exports.renderUpdate = function(req, res) {
  ApplicationDescriptor.findOne({applicationID: req.params.id}, function(err, appDescriptor) {
    if (err) {
      util.renderError(req, 'Failed to load Application Descriptor ' + req.params.id, err);
      res.redirect('/tab/apps');
    } else {
      if (! appDescriptor) {
        util.renderError(req, 'Failed to find Application Descriptor ' + req.params.id, err);
        res.redirect('/tab/apps/');
      } else {
        appDescriptor.description = req.body.description;
        appDescriptor.publicKey = req.body.publicKey;
        appDescriptor.enabled = (req.body.enabled === 'Y');
        appDescriptor.updateDate = Date.now();

        appDescriptor.save(function(err) {
          if (err) {
            util.renderError(req, 'Failed to save Application Descriptor ' + req.params.id, err);
          } else {
            util.renderInfo(req, 'Application Descriptor ' + req.params.id + ' was updated');
          }

          res.redirect('/tab/apps');
        });
      }
    }
  });
};

exports.renderDelete = function(req, res) {
  ApplicationDescriptor.remove({applicationID: req.params.id}, function(err) {
    if (err) {
      util.renderError(req, 'Failed to delete Application Descriptor ' + req.params.id, err);
    } else {
      util.renderInfo(req, 'Application Descriptor ' + req.params.id + ' was deleted');
    }

    res.redirect('/tab/apps');
  });
};

