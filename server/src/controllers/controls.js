var connected = false;

var url = require('url')
    , util = require('./util');
var logger = require('./logFactory').getLogger();

exports.render = function(req, res) {
  res.render('admin-controls.jade');
};

var mqtt = require('mqtt');

// Create a client connection
var client = mqtt.createClient(17091, "m12.cloudmqtt.com", {
  username: "mikbot",
  password: "mikhailbot" 
});

client.on('connect', function() { // When connected
  console.log("mqtt connected!")
  connected = true;
});

exports.render = function(req, res) {
  res.render('admin-controls.jade');
}

exports.processArrow = function(req, res) {
  var urlParts = url.parse(req.url);
  if (urlParts.path.endsWith("arrowUp")){
    client.publish('move', 'F', function() {});
  }else if(urlParts.path.endsWith("arrowDown")){
    client.publish('move', 'B', function() {});
  }else if(urlParts.path.endsWith("arrowLeft")){
    client.publish('move', 'L', function() {});
  }else if (urlParts.path.endsWith("arrowRight")){
    client.publish('move', 'R', function() {});
  }

  logger.info(urlParts);
  res.status.send(200);
};