var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var formSchema = new Schema ({
    username: {
      type: String
    },

    description: {
      type: String
    },

    timeBegin: {
      type : Date,
      default: new Date()
    },

    timeEnd: {
      type : Date,
      default: new Date(+new Date() + 1*24*60*60*1000)

    },

    priority: {
      type: Number

    },

    filename: {
      type: String
    }

});

module.exports.forms = mongoose.model('Form', formSchema);
