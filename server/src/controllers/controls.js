exports.render = function(req, res) {
  res.render('admin-controls.jade');


};

exports.processArrow  = function(req, res) {
  arrow = req.param('arrow');
  //res.render('admin-controls.jade');
  console.log("success1");
  if(arrow == "L"){
    console.log("succees");
  }
};