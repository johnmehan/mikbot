var url = require('url')
    , util = require('./util');
var logger = require('./logFactory').getLogger();

exports.render = function(req, res) {
  res.render('admin-controls.jade');
};

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