/**
 * Defines MongoDB schema for User.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var mongoose = require('mongoose')
  , crypto = require('crypto');

var util = require('../controllers/util');

var Schema = mongoose.Schema;

exports.encryptPassword = encryptPassword = function (passwordRaw) {
  if (typeof passwordRaw === 'string') {
    if (passwordRaw.length < 6)  return '';

    return crypto.createHash('md5').update(passwordRaw, 'ascii').digest('hex');
  }

  return passwordRaw;
};

// Definition
var userSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}, trim: true}
  , password: {type: Buffer, set: encryptPassword, required: true}
});

exports.User = User = mongoose.model('User', userSchema);

//userSchema.path('username').validate(util.uniqueFieldInsensitive('User', 'username'), 'unique');
//userSchema.path('password').validate(util.isNotEmpty, 'password');
//userSchema.plugin(mongoose.availablePlugins.timestamper);

