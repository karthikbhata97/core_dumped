var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var deviceSchema = new Schema ({
  deviceName: {
    type: String
  },

  password: {
    type: String
  }

});

module.exports.devices = mongoose.model('Device', deviceSchema);
