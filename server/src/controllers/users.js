/**
 * Business logic for managing users.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var url = require('url')
  , util = require('./util');

require('../models/user');

var logger = require('./logFactory').getLogger();

var sysUsername = 'sysadmin';
/**
 * Minimum 6 characters (letters, digits or underscore), with at least 1 digit,
 * 1 lowercase and 1 uppercase letter.
 */
var sysPasswordDefault = 'admin1Pwd';

User.findOne({username: sysUsername}, function(err, usr) {
  if (! usr) {
    usr = new User({username: sysUsername, password: sysPasswordDefault});

    usr.save(function(err) {
      if (err)  util.handleError(err);

      logger.info('Created system-admin user');
    });
  }
});

exports.checkAuth = function(req, res, next) {
  if (! req.isAuthenticated())  return res.redirect('/admin');

  next();
};

exports.renderPasswordUpdate = function(req, res) {
  User.findOne({
      username: req.user.username, password: encryptPassword(req.body.oldPwd)
    }, function(err, usr) {
      if (err) {
        util.renderError(req, 'Failed to change password', err);
      } else {
        if (usr) {
          usr.password = req.body.newPwd;

          usr.save(function(err) {
            if (err) {
              util.renderError(req, 'Failed to save password', err);
            } else util.renderInfo(req, 'Password was changed');
          });
        } else util.renderError(req, 'Wrong old password');
      }

      res.redirect('/tab/auth');
    });
};
/**
 * Processes the following request:
 * - URL:
 *     /user
 * - Method:
 *     POST
 * - Request body ("Content-Type"="text/plain"):
 *     {"username":"scott","password":"tiger"}
 */
exports.createUser = function(req, res) {
  var data = '';

  req.on('data', function(chunk) {
    // Check upper limit, in case of DOS attack using message overflow
    if (data.length > 500) {
      return new Error('Message too big');
    }

    data += chunk;
  });

  req.on('end', function() {
    var userData;

    try {
      userData = JSON.parse(data);
    } catch (ex) {
      logger.error('Failed to parse request data: ' + ex);
      res.statusCode = 500;
      res.send('Error: ' + ex);
      return;
    }
    //logger.info( "User info, userData:" + userData );
    //logger.info( "User info, username:" + userData.username + ", password:" + userData.password );
    //var user = new User(userData);
    var user = new User({username: userData.username, password: '${userData.password}'});
    //logger.info( "User info, user.username:" + user.username );
    //logger.info( "User info, user.password:" + user.password.toString() );
    user.save(function(err) {
      if (err) {
        logger.error('Failed to save User : ' + err);
        res.statusCode = 500;
        res.send('Error: ' + err);
      } else {
        res.send("User :" + userData.username + " added" );
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
 * - URL:  /user/{username}
 * - Method:  DELETE
 */
exports.removeUser = function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;
  logger.info('system.removeUser called, pathname:' + pathname);

  req.on('end', function() {
    logger.info('users.removeUser end triggered' );
    var userParam = req.params.id;
    logger.info('users.removeUser username is:' + userParam );
    User.remove({username: userParam}, function(err, result) {
        if (err) {
            logger.error('Failed to delete user: ' + err);
            res.statusCode = 500;
            res.send('Error: ' + err);
        } else if (! result) {
             res.statusCode = 404;
             res.send('Not found');
        } else {
          res.send("deleted user  :" + userParam);
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
 * - URL:  /user/{username}
 * OR list all
 * - URL: /user
 * - Method:  GET
 */
exports.getUser= function(req, res) {
  var urlParts  = url.parse(req.url);
  var pathname = urlParts.pathname;

  logger.info('users.getUser called, pathname:' + pathname);

  req.on('end', function() {
    logger.info('users.getUser end triggered' );
    var userParam = pathname.split('/').pop();
    logger.info('users.getUser username is:' + userParam );
    if ( userParam != null && userParam != 'user' ) {
        User.findOne({ username: userParam}, function(err, result) {
            if (err) {
                logger.error('Failed to load Application Descriptor: ' + err);
                res.statusCode = 500;
                res.send('Error: ' + err);
            } else if (! result) {
                 res.statusCode = 404;
                 res.send('Not found');
            } else {
              res.send(JSON.stringify(result));
            }
        });
    } else {
        logger.info('users.getUser username is: null' );
        User.find({},function(err, users) {
            if (err) {
                logger.error('Failed to load Users: ' + err);
                res.statusCode = 500;
                res.send('Error: ' + err);
            } else if (! users ) {
                res.statusCode = 404;
                res.send('Not found');
            } else {
                res.send(JSON.stringify(users));
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

