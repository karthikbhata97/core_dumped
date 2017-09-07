var Form = require('../models/form').forms;
var path = require('path');
var fs = require('fs');

module.exports.add = function(req, res) {
  var record = JSON.parse(req.body.record);
  var tmp_path = req.file.path;
  var new_form = {
    username: record["username"],
    description: record["description"],
    timeBegin: record["fromDate"],
    timeEnd: record["toDate"],
    filename: record["filename"]
  }
  var form = new Form(new_form);
  form.save(function(err, result) {
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      var dst_path = path.resolve(__dirname + '/../attachments/' + result._id + '.png');
      console.log(tmp_path);
      console.log(dst_path);
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
