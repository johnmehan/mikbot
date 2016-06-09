/**
 * Authentication using DB-managed credentials.
 *
 * (c)2014 Irdeto, All Rights Reserved.
 */

var LocalStrategy = require('passport-local').Strategy;

require('../models/user');

module.exports = function(passport) {
  passport.serializeUser(function(usr, done) {
    done(null, usr.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, function(err, usr) {
      done(err, usr);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    }, function(username, password, done) {
      User.findOne({username: username}, function(err, usr) {
        if (err)  return done(err);

        if (! usr)  return done(null, false, {message: 'Unknown user'});

        if (usr.password != encryptPassword(password)) {
          return done(null, false, {message: 'Invalid password'});
        }

        return done(null, usr);
      });
    }
  ));
};

