/**
 * Business logic for processing an incoming telemetry message.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var async = require('async')
  , crypto = require('crypto')
  , SysCtrl = require('./system')
  , elgamal = require('../lib/elgamal')
  , ApplicationDescriptor = require('../models/applicationDescriptor')
  , DeviceModel = require('../models/deviceModel')
  , Device = require('../models/device')
  , Application = require('../models/application')
  , Event = require('../models/event');

var logger = require('./logFactory').getLogger();

var TAG = 'triggers'
  , MAX_MESSAGE_SIZE = 10240  // 10 Kb
  , IV_BUFFER = new Buffer([
      0x55, 0xee, 0x4a, 0xcd, 0x4b, 0x44, 0x97, 0x94,
      0xf3, 0x2d, 0xe4, 0x08, 0x84, 0x3e, 0x05, 0x9b
    ]);

/**
 * Processes the following request:
 * - URL:
 *     /telemetry
 * - Method:
 *     POST
 * - Request body ("Content-Type"="text/plain"):
 *     APP-ID;base64(enc(MSG-DATA));base64(enc(MSG-KEY));base64(SIGNATURE)
 *
 * MSG-DATA is composed of following high-level JSON structure:
 *   {NONCE,[{SEQ-NUMBER,TRIGGER-ID,TRIGGER-DATA}]}
 *
 * SIGNATURE is composed of following signed data:
 *   enc(MSG-DATA) + enc(MSG-KEY)
 *
 * Processing flow:
 * 1. Get Server Private-Key from DB.
 * 2. Split message by delimiter to get APP-ID, MSG-DATA, MSG-KEY, SIGNATURE.
 * 3. Base64 decode MSG-DATA, MSG-KEY, SIGNATURE.
 * 4. Get App Public-Key from DB using APP-ID.
 * 5. Verify message using SIGNATURE and App Public-Key.
 * 6. Decrypt MSG-KEY using Server Private-Key.
 * 7. Decrypt MSG-DATA (UTF-8 character-set) using MSG-KEY.
 * 8. Parse MSG-DATA as JSON string.
 * 9. Send response to client.
 * 10. Check NONCE.
 * 11. Persist contents of the array of TRIGGER items contained within MSG-DATA.
 */
exports.create = function(req, res) {
    var appID
    , telemetryBStr
    , msgKeyBuf
    , signatureBuf
    , telemetry
    , appDescriptor
    , eventList = []
    , replySent = false;  // If a function returns error after client response was sent

  ServerKey.findOne({}, function(err, result) {
    if (err)  reply(err);

    if (result) {
      elgamal.bindPrivateKey(result.privateKey);

      async.auto({
        parse: parse,

        getAppDescriptor: ['parse', getAppDescriptor],

        verifySignature: ['getAppDescriptor', function(callback) {
          logger.debug('>> SIGNATURE: ' + signatureBuf.toString('hex'));

          var verifier = crypto.createVerify('SHA1');

          verifier.update(telemetryBStr + msgKeyBuf.toString('binary'));

          if (! verifier.verify(appDescriptor.publicKey, signatureBuf)) {
            return callback(new Error('Message verification failed'));
          }

          callback();
        }],

        decrypt: ['verifySignature', decrypt],

        checkNonce: ['decrypt', function(callback) {
          if (! telemetry.nonce)  return callback(new Error('Missing nonce'));

          callback(telemetry.nonce < Date.now() - SysCtrl.getParameter(SysCtrl.ParameterKey.NonceRangeMilliseconds)
                   ? new Error('Request time-out') : null);
        }],

        reply: ['decrypt', function(callback) {
          reply(null, callback);
        }],

        processData: ['checkNonce', processData],

        processDevice: ['processData', processDevice]
      }, function(err) {
        if (err)  reply(err);
      });
    } else {
      reply(new Error('Server Private-Key is not provisioned'));
    }
  });

  function parse(callback) {
    var data = '';

    req.on('data', function(chunk) {
      data += chunk;

      // Check upper limit, in case of DOS attack using message overflow
      if (data.length > MAX_MESSAGE_SIZE) {
        var err = new Error('Message too big');

        err.httpCode = 413;
        req.removeAllListeners();
        res.header('Connection', 'close');
        callback(err);
      }
    });

    req.on('end', function() {
      var content = data.split(';');

      if (content.length != 4) {
        return callback(new Error('Invalid message format'));
      }

      appID = content[0];

      try {
        telemetryBStr = new Buffer(content[1], 'base64').toString('binary');
        msgKeyBuf = new Buffer(content[2], 'base64');
        signatureBuf = new Buffer(content[3], 'base64');
        callback();
      } catch (ex) {
        var err = new Error('Failed to decode data: ' + ex.message);

        err.httpCode = 400;
        callback(err);
      }
    });

    req.on('error', function(ex) {
      var err = new Error('Failed to parse message: ' + ex.message);

      err.httpCode = 400;
      callback(err);
    });
  }

  function getAppDescriptor(callback) {
    ApplicationDescriptor.findOne({applicationID: appID}, function(err, result) {
      if (err) {
        return callback(new Error(
                  'Failed to find Application Descriptor ' + appID + ': '
                  + err.message));
      }

      if (! result) {
        return callback(new Error('Missing Application Descriptor ' + appID));
      }

      if (! result.enabled) {
        return callback(new Error(
                  'Application ' + appID + ' is disabled, no event collection'));
      }

      appDescriptor = result;
      callback();
    });
  }

  function decrypt(callback) {
    try {
      var decMsgKeyBuf = new Buffer(32);

      elgamal.decrypt(msgKeyBuf, decMsgKeyBuf);
      msgKeyBuf = decMsgKeyBuf.slice(16, 32);
      logger.debug('>> MSG-KEY: ' + msgKeyBuf.toString('hex'));
    } catch (ex) {
      return callback(new Error('Failed to decrypt Message-Key: ' + ex.message));
    }

    try {
      var decipher = crypto.createDecipheriv('aes-128-cbc', msgKeyBuf, IV_BUFFER)
        , jsonData = decipher.update(telemetryBStr, 'binary', 'utf8')
                     + decipher.final('utf8');

      logger.debug('>> MSG-DATA: ' + jsonData);
      telemetry = JSON.parse(jsonData);
      callback();
    } catch (ex) {
      callback(new Error('Failed to decrypt message: ' + ex.message));
    }
  }

  function reply(err, callback) {
    if (replySent)  return;  // This should only be called once

    replySent = true;

    if (err) {
      logger.error(err.message);

      if (err.httpCode) {
        res.send(err.httpCode, err.message);
      } else {
        res.send(500);
      }
    } else {
      res.send(201);
      callback();
    }
  }

  function processData(callback) {
    var isError = false
      , events = telemetry[TAG]
      , numEvents = events.length
      , countDown = numEvents
      , headerAddress = req.headers['X-Forwarded-For']
      , remoteAddress = (! headerAddress || headerAddress.length == 0
                         ? req.connection.remoteAddress : headerAddress);

    logger.debug('processData - App-ID: ' + appID + ', events: ' + numEvents);

    for (var i = 0; i < numEvents; i++) {
      var event = new Event(events[i]);

      event.deviceID = events[i].data.device.deviceID;
      event.applicationID = events[i].data.device.application.applicationID;
      event.externalIPAddress = remoteAddress;

      event.save(function(err) {
        if (err) {
          isError = true;
          return callback(new Error(
                    'Failed to save event ' + event + ': ' + err.message));
        }

        eventList.push(event);

        if (--countDown == 0)  callback();
      });

      if (isError)  break;  // Exit loop in case of error
    }
  }

  function processDevice(callback) {
    if (eventList.length == 0) {
      return callback(new Error('No events to process'));
    }

    var event = eventList.shift()  // Get 1st event (its removed from list)
      , eventDevice = new Device(event.data.device)
      , eventApplication = new Application(event.data.device.application);

    eventDevice.externalIPAddress = event.externalIPAddress;

    // Loop thru events, consolidating in memory:
    // - Device object.
    // - Application object.
    eventList.forEach(function(element) {
      Device.updateObject(element.data.device, eventDevice);
      Application.updateObject(element.data.device.application, eventApplication);
    });

    // Get Device from DB
    Device.findOne({deviceID: event.deviceID}, function(err, dbDevice) {
      if (err) {
        return callback(new Error(
                  'Failed to find Device ' + event.deviceID + ': ' + err.message));
      }

      // Update Device in DB.
      // Relationship:
      //   Device -> DeviceModel
      //          -> [Application] -> [Content]
      // Currently:
      //   Device -> DeviceModel
      //          -> Application
      // To do:
      //   Device -> Application -> Content

      if (! dbDevice) {
        var eventDeviceModel = new DeviceModel(event.data.device.model);

        // Loop thru events, consolidating in memory:
        // - DeviceModel object.
        eventList.forEach(function(element) {
          DeviceModel.updateObject(element.data.device.model, eventDeviceModel);
        });

        // Create Device in DB with event Device data

        logger.debug('Creating Device ' + eventDevice.deviceID);

        DeviceModel.findOne({
            manufacturer: eventDeviceModel.manufacturer,
            name: eventDeviceModel.name
          }, '_id', function(err, dbDeviceModel) {
            if (err) {
              return callback(new Error(
                        'Failed to find Device Model for Device '
                        + eventDevice.deviceID + ': ' + err.message));
            }

            if (! dbDeviceModel) {
              eventDeviceModel.save(function(err) {
                if (err) {
                  callback(new Error(
                    'Failed to create Device Model for Device '
                     + eventDevice.deviceID + ': ' + err.message));
                }
              });

              eventDevice.deviceModel = eventDeviceModel._id;
            } else {
              eventDevice.deviceModel = dbDeviceModel._id;
            }

            eventDevice.application = eventApplication._id;

            eventDevice.save(function(err) {
              if (err) {
                return callback(new Error(
                          'Failed to create Device ' + eventDevice.deviceID
                          + ': ' + err.message));
              }

              eventApplication.save(function(err) {
                if (err) {
                  return callback(new Error(
                            'Failed to create Application '
                            + eventDevice.application + ' for Device '
                            + eventDevice.deviceID + ': ' + err.message));
                }

                callback();
              });
            });
          });
      } else {
        logger.debug('Updating Device ' + dbDevice.deviceID);

        // Update the Device object in memory and then save it in DB
        Device.updateObject(eventDevice, dbDevice);
        dbDevice.save(function(err) {
          if (err) {
            return callback(new Error(
                      'Failed to update Device ' + dbDevice.deviceID + ': '
                      + err.message));
          }

          Application.findById(dbDevice.application, function(err, dbApplication) {
            if (err) {
              return callback(new Error(
                        'Failed to find Application ' + dbDevice.application
                        + ' for Device ' + dbDevice.deviceID + ': ' + err.message));
            }

            // Update the Application object in memory and then save it in DB
            Application.updateObject(eventApplication, dbApplication);
            dbApplication.save(function(err) {
              if (err) {
                return callback(new Error(
                          'Failed to update Application ' + dbDevice.application
                          + ' for Device ' + dbDevice.deviceID + ': ' + err.message));
              }

              callback();
            });
          });
        });
      }
    });
  }
};

