module.exports.login = function(req, res) {
  if(req.body.username=="admin" && req.body.password=="admin")
  		res.send({success: true, message: "Success"});
  	else
  		res.send({success: false, message: "Login Failed"});
}
