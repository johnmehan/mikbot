/**
 * Business logic for managing Devices.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose')
  , url = require('url')
  , Device = require('../models/device');

var logger = require('./logFactory').getLogger();

/**
 * Demo API.
 *
 * TBD: Move and add authentication/authorization check.
 *
 * Processes the following request:
 * - URL:  /device?output={google}
 * - Method:  GET
 *
 * Returns an array of devices.
 */
exports.get = function(request, response) {
//  var urlParts = url.parse(request.url);
//  var pathname = urlParts.pathname;

  var outputType = request.query["output"];
  var outputGoogleDataTable = (outputType === "google");
  var callbackName = request.query['callback'];

  Device.find({}).populate('deviceModel').populate('application').exec(function(err, devices) {
    if (err) {
      logger.error("Failed to get device list: " + err);
      response.statusCode = 500;
      response.send(err);
    } else if (! devices) {
      response.statusCode = 404;
      response.send("Not found");
    } else {
      if (outputGoogleDataTable === true) {
        // Set up the columns
        var datatable = "{'cols': [{'id': 'col_1', 'label': 'ID', 'type': 'string'},";
        if (callbackName != null) {
            datatable = callbackName + "(" + datatable;
        }

        datatable += " {'id': 'col_2', 'label': 'Compromised', 'type': 'boolean'},";
        datatable += " {'id': 'col_3', 'label': 'Device ID', 'type': 'string'},";
        datatable += " {'id': 'col_4', 'label': 'Manufacturer', 'type': 'string'},";
        datatable += " {'id': 'col_5', 'label': 'Name', 'type': 'string'},";
        datatable += " {'id': 'col_6', 'label': 'CPU', 'type': 'string'},";
        datatable += " {'id': 'col_7', 'label': 'Screen Density','type': 'number'},";
        datatable += " {'id': 'col_8', 'label': 'Screen Width', 'type': 'number'},";
        datatable += " {'id': 'col_9', 'label': 'Screen Height', 'type': 'number'},";
        datatable += " {'id': 'col_10', 'label': 'OS', 'type': 'string'},";
        datatable += " {'id': 'col_11', 'label': 'OS Version', 'type': 'string'},";

        datatable += " {'id': 'col_12', 'label': 'Kernel Version', 'type': 'string'},";
        datatable += " {'id': 'col_13', 'label': 'OEM Locked', 'type': 'boolean'},";

        datatable += " {'id': 'col_14', 'label': 'RAM', 'type': 'number'},";
        datatable += " {'id': 'col_15', 'label': 'Disk', 'type': 'number'},";
        datatable += " {'id': 'col_16', 'label': 'Serial Number', 'type': 'string'},";
        datatable += " {'id': 'col_17', 'label': 'IP Address', 'type': 'string'},";
        datatable += " {'id': 'col_18', 'label': 'Application ID', 'type': 'number'},";
        datatable += " {'id': 'col_19', 'label': 'Application Version', 'type': 'string'},";
        datatable += " {'id': 'col_20', 'label': 'Application ACF', 'type': 'string'},";
        datatable += " {'id': 'col_21', 'label': 'Application NCV', 'type': 'number'},";
        datatable += " {'id': 'col_22', 'label': 'ActiveCloak Version', 'type': 'string'},";

        datatable += " {'id': 'col_23', 'label': 'Installation ID', 'type': 'number'},";
        datatable += " {'id': 'col_24', 'label': 'Installation Date', 'type': 'string'},";
        datatable += " {'id': 'col_25', 'label': 'Activation Date', 'type': 'string'},";
        datatable += " {'id': 'col_26', 'label': 'DRM Type', 'type': 'string'},";
        datatable += " {'id': 'col_27', 'label': 'IVPass', 'type': 'boolean'},";

        datatable += " {'id': 'col_28', 'label': 'Update Date', 'type': 'string'},";
        datatable += " {'id': 'col_29', 'label': 'Create Date', 'type': 'string'}],";

        // Add the row data
        datatable += " rows: [";
        var counter = devices.length;
        devices.forEach(function(device) {
          datatable += "{'c': [";
          datatable += "{'v': '" + device._id + "'}";
          datatable += (device.compromised == null)?",null":",{'v': " + device.compromised + "}";
          datatable += (device.deviceID == null)?",null":",{'v': '" + device.deviceID + "'}";
          datatable += (device.deviceModel.manufacturer == null)?",null":",{'v': '" + device.deviceModel.manufacturer + "'}";
          datatable += (device.deviceModel.name == null)?",null":",{'v': '" + device.deviceModel.name + "'}";
          datatable += (device.deviceModel.cpu == null)?",null":",{'v': '" + device.deviceModel.cpu + "'}";
          datatable += (device.deviceModel.screenDensity == null)?",null":",{'v': " + device.deviceModel.screenDensity + "}";
          datatable += (device.deviceModel.screenWidth == null)?",null":",{'v': " + device.deviceModel.screenWidth + "}";
          datatable += (device.deviceModel.screenHeight == null)?",null":",{'v': " + device.deviceModel.screenHeight + "}";
          datatable += (device.os == null)?",null":",{'v': '" + device.os + "'}";
          datatable += (device.osVersion == null)?",null":",{'v': '" + device.osVersion + "'}";
          datatable += (device.kernelVersion == null)?",null":",{'v': '" + device.kernelVersion + "'}";
          datatable += (device.oemLocked== null)?",null":",{'v': " + device.oemLocked + "}";
          datatable += (device.physicalRam == null)?",null":",{'v': " + device.physicalRam + "}";
          datatable += (device.physicalDisk == null)?",null":",{'v': " + device.physicalDisk + "}";
          datatable += (device.serialNumber == null)?",null":",{'v': '" + device.serialNumber + "'}";
          datatable += (device.externalIPAddress == null)?",null":",{'v': '" + device.externalIPAddress + "'}";
          datatable += (device.application.applicationID == null)?",null":",{'v': " + device.application.applicationID + "}";
          datatable += (device.application.applicationVersion == null)?",null":",{'v': '" + device.application.applicationVersion + "'}";
          datatable += (device.application.ACF == null)?",null":",{'v': '" + device.application.ACF + "'}";
          datatable += (device.application.NCV == null)?",null":",{'v': " + device.application.NCV + "}";
          datatable += (device.application.activeCloakVersion == null)?",null":",{'v': '" + device.application.activeCloakVersion + "'}";
          datatable += (device.application.installationID == null)?",null":",{'v': " + device.application.installationID + "}";
          datatable += (device.application.installationDate == null)?",null":",{'v': '" + device.application.installationDate.getFullYear()
                        + "-" + device.application.installationDate.getMonth()
                        + "-" + device.application.installationDate.getDay()
                        + " " + device.application.installationDate.getHours()
                        + ":" + device.application.installationDate.getMinutes()
                        + ":" + device.application.installationDate.getSeconds() + "'}";
          datatable += (device.application.activationDate == null)?",null":",{'v': '" + device.application.activationDate.getFullYear()
                        + "-" + device.application.activationDate.getMonth()
                        + "-" + device.application.activationDate.getDay()
                        + " " + device.application.activationDate.getHours()
                        + ":" + device.application.activationDate.getMinutes()
                        + ":" + device.application.activationDate.getSeconds() + "'}";
          datatable += (device.application.drmType == null)?",null":",{'v': " + device.application.drmType + "}";
          datatable += (device.application.ivPass == null)?",null":",{'v': " + device.application.ivPass + "}";
          datatable += (device.updateDate == null)?",null":",{'v': '" + device.updateDate.getFullYear()
                        + "-" + device.updateDate.getMonth()
                        + "-" + device.updateDate.getDay()
                        + " " + device.updateDate.getHours()
                        + ":" + device.updateDate.getMinutes()
                        + ":" + device.updateDate.getSeconds() + "'}";
          datatable += (device.createDate == null)?",null":",{'v': '" + device.createDate.getFullYear()
                        + "-" + device.createDate.getMonth()
                        + "-" + device.createDate.getDay()
                        + " " + device.createDate.getHours()
                        + ":" + device.createDate.getMinutes()
                        + ":" + device.createDate.getSeconds() + "'}";
          datatable += "]}";

          if (--counter > 0) {
            datatable += ",";
          }
        });

        datatable += "]}";

        if (callbackName != null) {
          datatable += ")" ;
          response.set('Content-Type', 'text/javascript');
        }

        response.send(datatable);
      } else {
        response.send(JSON.stringify(devices));
      }
    }
  });

  request.on('error', function(ex) {
    response.statusCode = 500;
    response.send("Error: " + ex);
  });
};

