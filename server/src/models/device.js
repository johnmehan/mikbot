/**
 * Defines MongoDB schema for Device.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose');

var DeviceModel = require('./deviceModel')
  , Application = require('./application')
  , util = require('../controllers/util');

var Schema = mongoose.Schema;

// Definition
var deviceSchema = new Schema({
  deviceID: {type: Number, required: true, index: {unique: true}}
  , os: String
  , osVersion: String
  , kernelVersion: String
  , serialNumber: String
  , fingerprintHash: Number
  , physicalRam: Number
  , physicalDisk: Number
  , availableRam: Number
  , availableDisk: Number
  , cpuUtilization: Number
  , oemLocked: Boolean
  , compromised: Boolean
  , platformModified: {type: Boolean, default: false}
  , physicalLink: String
  , externalIPAddress: String
  , wifiMACAddress: String
  , bluetoothMACAddress: String
  , ethernetMACAddress: String
  , gpsLatitude: String
  , gpsLongitude: String
  , createDate: {type: Date, default: Date.now}
  , updateDate: {type: Date, default: Date.now}
  , deviceModel: {type: Schema.Types.ObjectId, ref: 'DeviceModel'}
  , application: {type: Schema.Types.ObjectId, ref: 'Application'}
// Alternatively, for more than 1 application:
// , application: [{type: Schema.Types.ObjectId, ref: 'Application'}]
});

deviceSchema.set('toObject', {getters: true});

deviceSchema.statics.updateObject = function(source, target) {
  util.update(source.os, target.os);
  util.update(source.osVersion, target.osVersion);
  util.update(source.kernelVersion, target.kernelVersion);
  util.update(source.serialNumber, target.serialNumber);
  util.update(source.fingerprintHash, target.fingerprintHash);
  util.update(source.physicalRam, target.physicalRam);
  util.update(source.physicalDisk, target.physicalDisk);
  util.update(source.availableRam, target.availableRam);
  util.update(source.availableDisk, target.availableDisk);
  util.update(source.cpuUtilization, target.cpuUtilization);
  util.update(source.oemLocked, target.oemLocked);
  util.update(source.compromised, target.compromised);
  util.update(source.platformModified, target.platformModified);
  util.update(source.physicalLink, target.physicalLink);
  util.update(source.externalIPAddress, target.externalIPAddress);
  util.update(source.wifiMACAddress, target.wifiMACAddress);
  util.update(source.bluetoothMACAddress, target.bluetoothMACAddress);
  util.update(source.ethernetMACAddress, target.ethernetMACAddress);
  util.update(source.gpsLatitude, target.gpsLatitude);
  util.update(source.gpsLongitude, target.gpsLongitude);

  // Create date is set on creation, update date for every update
  target.updateDate = Date.now();
};

// Register the schema in mongoose and export the model
module.exports = Device = mongoose.model('Device', deviceSchema);

