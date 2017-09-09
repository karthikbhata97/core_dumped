var Form = require('../models/form').forms;
var Device = require('../models/device').devices;
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var url = require('url');

module.exports.add = function(req, res) {

  var record = JSON.parse(req.body.record);
  console.log(record.devicename);
  var tmp_path = req.file.path;
  var new_form = {
    username: record["username"],
    description: record["description"],
    timeBegin: record["fromDate"],
    timeEnd: record["toDate"],
    priority : record["priority"],
    devices : record["devicename"],
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
      var dst_path = path.resolve(__dirname + '/../../form/attachments/' + result._id + '.png');
      console.log(tmp_path);
      console.log(dst_path);
      fs.rename(tmp_path, dst_path, function(err) {
        if(err) {
          console.log(err);
          res.end();
        }
        else {
          res.send({success: true, reason: "Success"});
          console.log("Happens");
          var data = {
            "requests": [
              {
                "image": {
                  "content": new Buffer(fs.readFileSync(dst_path)).toString("base64")
                },
                "features": [
                  {
                    "type": "TEXT_DETECTION"
                  }
                ]
              }
            ]
          }
          request.post(
            'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAmPP-Jzyti3JZo1Emtx_mRIVVzsC6hHt4',
            { json: data },
            function (error, response, body) {
              console.log("request made");
              if (!error && response.statusCode == 200) {
                var words = []
                var annot = body.responses[0].textAnnotations;
                for (var i=1;i<annot.length;i++) {
                  if(annot[i].description.length>4)
                  words.push(annot[i].description);
                  if(i==annot.length-1) {
                    console.log(words);
                    Form.update({_id:result._id}, {$set: {words: words}}, function(err, result) {
                      if(err) {
                        console.log("Failed to add matches");
                        console.log(err);
                      }
                      else {
                        console.log("Success");
                      }
                    })
                  }
                }
              }
            }
          );
        }
      });
    }
  });
}

module.exports.adddevice = function(req,res){
  var new_device = {
    deviceName: req.body.deviceName,
    password: req.body.password
  }

  var device = new Device(new_device);
  device.save(function(err, result) {
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      res.send({success: true, reason: "Success"});
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

module.exports.getdevices = function(req,res){
  Device.find({}).
  select({deviceName: 1}).
  exec(function(err, result) {
    if(err){
      console.log(err);
      res.end();
    }
    else {
      res.send(result);
    }
  })
}

module.exports.getdata = function(req, res) {
  authenticate(req.body.devicename, req.body.password, function(status) {
    if(!status) {
      res.status(400).send({
        message: "Invalid credentials"
      })
    }
    else {
      Form.
      find({
        timeBegin: {$lte: new Date()},
        timeEnd: {$gte: new Date()},
        devices: {$in: [req.body.devicename]}
      }).
      sort({ priority: -1 }).
      limit(1).
      exec(function(err, result) {
        res.send(result);
      });
    }
  })
}

var authenticate = function(deviceName, password, callback) {
  Device.findOne({
    deviceName: deviceName,
    password: password
  }).
  exec(function(err, result) {
    if(err) {
      console.log(err);
      return callback(false);
    }
    if(result) {
      return callback(true);
    }
    else {
      return callback(false);
    }
  });
}

module.exports.deletedata = function(req,res){
  Form.findByIdAndRemove({_id:req.body._id},function(err,result){
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      console.log(result);
      res.send({"success":true});
    }
  });
}


module.exports.deleteDevice = function(req,res){
  Device.findByIdAndRemove({_id:req.body._id},function(err,result){
    if(err) {
      console.log(err);
      res.end();
    }
    else {
      console.log(result);
      res.send({"success":true});
    }
  });
}

module.exports.events = function(req, res) {
  var queryData = url.parse(req.url, true).query;
  var list = queryData.q.split('-');
  Form.find({words: {$in: list}}, function(err, form){
    console.log(err, form);
    // res.send(form)
    genhtml(form, function(r) {
      res.send(r);
    })
  });
}

var genhtml = function(form, callback) {
  var r = '<html><body>\
    <table>\
    <tr style="color:white;background-color:gray">\
      <th>USERNAME</th>\
      <th>START TIME</th>\
      <th>END TIME</th>\
      <th>PRIORITY</th>\
      <th>DESCRIPTION</th>\
      <th>IMAGE</th>\
    </tr>\
    '
  for(var i=0;i<form.length;i++)
  {
    r += '<tr>'
    r += '<th>' + form[i].username + '</th>'
    r += '<th>' + form[i].timeBegin + '</th>'
    r += '<th>' + form[i].timeEnd + '</th>'
    r += '<th>' + form[i].priority + '</th>'
    r += '<th>' + form[i].description + '</th>'
    r += '<th><a href="/attachments/' + form[i]._id + '.png">link</a></th>'
    r += '</tr>'
  }
  r += '</table></body></html>'
  return callback(r);
}
