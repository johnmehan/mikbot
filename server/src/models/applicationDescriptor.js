/**
 * Defines MongoDB schema for Application Descriptor.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Definition
var applicationDescriptorSchema = new Schema({
  applicationID: {type: Number, required: true, index: {unique: true}}
  , description: String
  , publicKey: {type: String, required: true}
  , enabled: {type: Boolean, default: true}
  , updateDate: {type: Date, default: Date.now}
});

// Register the schema in mongoose and export the model
module.exports = ApplicationDescriptor = mongoose.model('ApplicationDescriptor', applicationDescriptorSchema);

