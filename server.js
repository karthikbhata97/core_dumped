var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    morgan = require('morgan'),
    upload = multer({dest: __dirname+'/uploads'}),
    fs = require('fs'),
    loginController = require('./cloud/controllers/loginController');
    formController = require('./cloud/controllers/formController');

var watson = require('watson-developer-cloud');
var visual_recognition = watson.visual_recognition({
      api_key: 'ec0c21511f50aeaeda4bd9df2976b1adb2074644',
       version: 'v3',
      version_date: '2016-05-20'
    });
//     {
//   "url": "https://gateway-a.watsonplatform.net/visual-recognition/api",
//   "note": "It may take up to 5 minutes for this key to become active",
//   "api_key": "ec0c21511f50aeaeda4bd9df2976b1adb2074644"
// }

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/rvcehacks');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/form/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/form/main.html');
});

app.listen(3000, function() {
  console.log("HelloWorld");
});
var params = {
  images_file: fs.createReadStream('./form/attachments/59b3078cc9681007498c01d2.png')
};

visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));
});
app.post('/login', loginController.login);
app.post('/addrecord', upload.single('file'), formController.add);
app.post('/adddevice', formController.adddevice);
app.get('/fetchdetails', formController.fetch);
app.post('/getdata', formController.getdata);
app.post('/deletedata', formController.deletedata);
app.get('/getdevices' , formController.getdevices);
app.post('/deleteDevice', formController.deleteDevice);


//
// var fs = require('fs');
// var text2png = require('text2png');
// fs.writeFileSync('out.png', text2png('Hello!\n world', {textColor: 'black'}));
