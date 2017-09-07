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
      type: String
/*      type : Date,
      default: Date.now
*/
    },

    timeEnd: {
      type: String
/*      type : Date,
      default: new Date(+new Date() + 1*24*60*60*1000)
*/
    },

    filename: {
      type: String
    }

});

module.exports.forms = mongoose.model('Form', formSchema);
