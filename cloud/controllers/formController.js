var Form = require('../models/form').forms;

module.exports.add = function(req, res) {
  console.log(req);
  var tmp_path = req.file.path;
  var new_form = {
    username: req.body.username,
    description: req.body.description,
    fromDate: req.body.startdate,
    fromDate: req.body.enddate
  }
  var form = new Form(new_form);
  form.save(function(err, result) {
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      var dst_path = path.resolve(__dirname + '../attachments/' + result.id);
      fs.rename(tmp_path, dst_path, function(err) {
        if(err) {
          console.log(err);
          res.end();
        }
        else {
          res.send({success: true, reason: "Success"});
        }
      });
    }
  });
}
