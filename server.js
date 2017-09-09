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

app.listen(3005, function() {
  console.log("HelloWorld");
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
