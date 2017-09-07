var Form = require('../models/form').forms;
var path = require('path');
var fs = require('fs');
var moment = require('moment');

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
var ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
if(!(ISO_8601_FULL.test(new_form.timeBegin))){
  new_form.timeBegin = new Date();
  new_form.timeBegin = new_form.timeBegin.toISOString();
}
if(!(ISO_8601_FULL.test(new_form.timeEnd))){
  new_form.timeEnd = new Date();
  new_form.timeEnd = new_form.timeEnd.toISOString();
}

  var form = new Form(new_form);
  form.save(function(err, result) {
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      var dst_path = path.resolve(__dirname + '/../../form/attachments/' + result._id + '.jpeg');
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

module.exports.fetch = function(req,res){
var filepath = __dirname + '/../attachments/';
Form.find(function(err, result) {
  if(err){
    console.log(err);
    res.end();
  }
  else {
    res.send(result);
  }
})
}
