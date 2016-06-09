/**
 * Defines MongoDB schema for System.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Definition
var serverKeySchema = new Schema({
  privateKey: {type: Buffer, required: true}
  , updateDate: {type: Date, default: Date.now}
});

var systemParameterSchema = new Schema({
  key: {type: String, required: true, index: {unique: true}}
  , value: {type: String, required: true}
});

// Register the schema in mongoose and export the model
exports.ServerKey = ServerKey = mongoose.model('ServerKey', serverKeySchema);
exports.SystemParameter = SystemParameter = mongoose.model('SystemParameter', systemParameterSchema);

