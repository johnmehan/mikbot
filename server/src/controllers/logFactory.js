/**
 * File-based logger.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var winston = require('winston');

var logger = null;

/**
 * Initializes the log factory; must be called only once within overall app.
 */
exports.initialize = function(config) {
  if (! logger) {
    logger = new (winston.Logger)({
      transports: [
        new (winston.transports.File)({
          level: config.logLevel,
          filename: config.logPath,
          maxsize: config.logMaxSize,
          maxFiles: config.logMaxFiles,
          handleExceptions: true,
          json: false
        })
      ]
    });

    winston.remove(winston.transports.Console);
  }

  return logger;
};

/**
 * Returns the logger instance; must only be called after the log factory has
 * been initialized.
 */
exports.getLogger = function() {
  return logger;
};

