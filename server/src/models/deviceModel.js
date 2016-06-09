/**
 * Defines MongoDB schema for Device Model.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose');

var util = require('../controllers/util');

var Schema = mongoose.Schema;

// Definition
var deviceModelSchema = new Schema({
  manufacturer: String
  , name: String
  , cpu: String
  , screenDensity: Number
  , screenWidth: Number
  , screenHeight: Number
  , createDate: {type: Date, default: Date.now}
});

deviceModelSchema.statics.updateObject = function(source, target) {
  if (! target)  target = new DeviceModel();

  util.update(source.manufacturer, target.manufacturer);
  util.update(source.name, target.name);
  util.update(source.cpu, target.cpu);
  util.update(source.screenDensity, target.screenDensity);
  util.update(source.screenWidth, target.screenWidth);
  util.update(source.screenHeight, target.screenHeight);
};

// Indexes, _id field is autocreated and indexed.
deviceModelSchema.index({manufacturer:1, name:2}, {unique: true});

// Register the schema in mongoose and export the model
module.exports = DeviceModel = mongoose.model('DeviceModel', deviceModelSchema);

