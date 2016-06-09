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
  // publish a message to a topic
  client.publish('move', 'D', function() {
    console.log("Message is published");
    client.end(); // Close the connection when published
  });
});

exports.render = function(req, res) {
  res.render('admin-controls.jade');
}

exports.processArrow  = function(req, res) {
  var urlParts  = url.parse(req.url);
  if (urlParts.path.endsWith("arrowUP")){

  }else if(urlParts.path.endsWith("arrowDown")){

  }else if(urlParts.path.endsWith("arrowLeft")){

  }else if (urlParts.path.endsWith("arrowRight")){

  }

  logger.info(urlParts);
  res.send(200);
};