 var mongoose = require('mongoose');

// Attachment schema
 var attachmentSchema = mongoose.Schema({
     type: {
         type: String,
         required: [true, 'Type required'],
         validate: {
             validator: function(v) {
                 return /^(document|picture)$/.test(v);
             },
             message: '{VALUE} is not a valid attachment type!'
         }
     },
     attachmentid: {
         type: String,
         minlength: 5,
         required: [true, 'AttachmendID required']
     },
 },
     {
         versionKey: false
     });

 var Attachment = module.exports = mongoose.model('Attachment', attachmentSchema, 'attachment');

 // get attachment
 module.exports.getAttachment = function(callback, limit) {
     Attachment.find(callback).limit(limit);
 };

 // read by Id
 module.exports.getAttachmentById = function(id, callback) {
     Attachment.findById(id, callback);
 };

 // add attachment
 module.exports.addAttachment = function(attachment, callback) {
     Attachment.create(attachment, callback);
 };

 // update
 module.exports.updateAttachment = function(id, attachment, options, callback){
     var query = {_id: id};
     var update = {
         type: attachment.type,
         attachmentid: attachment.attachmentid
     };
     Attachment.findOneAndUpdate(query, update, options, callback);
 };

 // delete
 module.exports.removeAttachment = function(id, callback){
     var query = {_id: id};
     Attachment.remove(query, callback);
 };