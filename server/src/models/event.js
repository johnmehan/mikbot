/**
 * Defines MongoDB schema for Event.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Definition
var eventSchema = new Schema({
  deviceID: Number
  , applicationID: Number
  , triggerID: Number
  , seqNo: Number
  , status: {type: String, default: 'N'}  // N: New, P: Processed
  , triggerDate: {type: Date}
  , createDate: {type: Date, default: Date.now}
  , externalIPAddress: String
  , data: {type: Schema.Types.Mixed, required: true}
});

// Indexes, _id field is autocreated and indexed.
eventSchema.index({deviceID:1, applicationID:2, triggerID:3, triggerDate:4}, {unique: true});

// Register the schema in mongoose and export the model
module.exports = Event = mongoose.model('Event', eventSchema);

