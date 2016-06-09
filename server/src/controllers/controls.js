exports.render = function(req, res) {
  res.render('admin-controls.jade');


};

exports.processArrow  = function(req, res) {
  //res.render('admin-controls.jade');
  console.log("succees1");
  if(  req.params.arrow == "L"){
    console.log("succees");
  }
};