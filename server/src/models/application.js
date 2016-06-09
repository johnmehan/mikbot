/**
 * Defines MongoDB schema for Application.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose');

var util = require('../controllers/util');

var Schema = mongoose.Schema;

// Definition
var applicationSchema = new Schema({
  applicationID: {type: Number, required: true, index: {unique: true}}
  , activationDate: Date
  , installationDate: Date
  , ivPass: Boolean
  , antiDebugDisabled: Boolean
  , exploitDetectionEnabled: {type: Boolean, default: false}
  , ACF: String
  , NCV: String
  , activeCloakVersion: String
  , applicationVersion: String
  , installationID: {type: Number, default: 0}
  , drmType: Number
  , createDate: {type: Date, default: Date.now}
  , updateDate: {type: Date, default: Date.now}
 });

applicationSchema.statics.updateObject = function(source, target) {
  if (! target)  target = new Application();

  util.update(source.applicationID, target.applicationID);
  util.update(source.activationDate, target.activationDate);
  util.update(source.installationDate, target.installationDate);
  util.update(source.ivPass, target.ivPass);
  util.update(source.antiDebugDisabled, target.antiDebugDisabled);
  util.update(source.exploitDetectionEnabled, target.exploitDetectionEnabled);
  util.update(source.ACF, target.ACF);
  util.update(source.NCV, target.NCV);
  util.update(source.activeCloakVersion, target.activeCloakVersion);
  util.update(source.applicationVersion, target.applicationVersion);
  util.update(source.installationID, target.installationID);
  util.update(source.drmType, target.drmType);

  // Create date is set on creation, update date for every update
  target.updateDate = Date.now();
};

// Register the schema in mongoose and export the model
module.exports = Application = mongoose.model('Application', applicationSchema);

