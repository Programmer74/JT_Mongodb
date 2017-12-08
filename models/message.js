 var mongoose = require('mongoose');

// Message schema
 var messageSchema = mongoose.Schema({
     fromid: {
         type: String,
         minlength: 20,
         required: [true, 'FromID required']
     },
     toid: {
         type: String,
         minlength: 20,
         required: [true, 'ToID required']
     },
     data: {
         type: String,
         required: [true, 'Data required']
     },
     attachmentid: {
         type: String,
     }
 },
     {
         versionKey: false
     });

 var Message = module.exports = mongoose.model('Message', messageSchema, 'message');

 // get message
 module.exports.getMessage = function(callback, limit) {
     Message.find(callback).limit(limit);
 };

 // read by Id
 module.exports.getMessageById = function(id, callback) {
     Message.findById(id, callback);
 };

 // add message
 module.exports.addMessage = function(message, callback) {
     Message.create(message, callback);
 };

 // update
 module.exports.updateMessage = function(id, message, options, callback){
     var query = {_id: id};
     var update = {
         fromid: message.fromid,
         toid:  message.toid,
         data:  message.data,
         attachmentid: message.attachmentid
     };
     Message.findOneAndUpdate(query, update, options, callback);
 };

 // delete
 module.exports.removeMessage = function(id, callback){
     var query = {_id: id};
     Message.remove(query, callback);
 };