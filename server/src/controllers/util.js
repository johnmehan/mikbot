/**
 * Utility functions.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose')
  , os = require('os');

var logger = require('./logFactory').getLogger();

exports.appVersion = pkgVersion = require('../package.json').version;

exports.version = function(req, res) {
  res.json({version: pkgVersion});
};

exports.status = function(req, res) {
  res.json({hostname: os.hostname()
            , os: {
                osName: os.type()
                , osRelease: os.release()
                , osPlatform: os.platform()
                , osArchitecture: os.arch()
                , osTotalMemoryBytes: os.totalmem()
                , osFreeMemoryBytes: os.freemem()
                , osUptimeHours: os.uptime() / 3600}
            , process: {
                execPath: process.execPath
                , processMemoryUsageBytes: process.memoryUsage()
                , processUptimeMinutes: process.uptime() / 60}
            , cpus: os.cpus()});
};

exports.handleError = function(err) {
  logger.error(err);
  throw err;
};

exports.renderError = function(req, msg, err) {
  logger.error(msg + (err ? ' - ' + err : ''));
  req.flash('error', msg);
};

exports.renderInfo = function(req, msg) {
  logger.info(msg);
  req.flash('info', msg);
};

exports.uniqueFieldInsensitive = function(modelName, field) {
  return function(val, cb) {
    if (val && val.length) { // If string not empty/null
      // Only for new docs
      if (this.isNew) {
        mongoose.models[modelName].where(
          field, new RegExp('^' + val + '$', 'i')
        ).count(function(err,n) {
          // False when validation fails
          cb(n < 1);
        });
      } else {
        cb(true);
      }
    } else { // Raise error of unique if empty
      cb(false);
    }
  };
};

exports.isNotEmpty = function(str) {
  return (typeof str === 'string' && str.length);
};

exports.dateToString = function(milliseconds) {
  return new Date(milliseconds).toUTCString();
};

exports.update = function(val1, val2) {
  if (val1 != null && val1 != val2) {
    val2 = val1;
  }
};

/**
 * Merges the second object into the first one.
 *
 * @param {Object} obj1  First object.
 * @param {Object} obj2  Second object.
 * @param {Object} t  Placeholder.
 * @return {Object}  Returns the merged object.
 */
exports.merge = function(obj1, obj2, t) {
  for (t in obj2) {
    obj2.hasOwnProperty(t) && ((typeof obj1[t])[0] == 'o'
                               ? merge(obj1[t], obj2[t]) : obj1[t] = obj2[t]);
  }

  return obj1;
};

