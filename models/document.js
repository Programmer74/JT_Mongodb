 var mongoose = require('mongoose');

// Document schema
 var documentSchema = mongoose.Schema({
     url: {
         type: String,
         required: [true, 'URL required'],
         validate: {
             validator: function(v) {
                 return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
             },
             message: '{VALUE} is not a valid URL!'
         }
     },
     description: {
         type: String,
         minlength: 5,
         required: [true, 'Description required']
     }
 },
     {
         versionKey: false
     });

 var Document = module.exports = mongoose.model('Document', documentSchema, 'document');

 // get document
 module.exports.getDocument = function(callback, limit) {
     Document.find(callback).limit(limit);
 };

 // read by Id
 module.exports.getDocumentById = function(id, callback) {
     Document.findById(id, callback);
 };

 // add document
 module.exports.addDocument = function(document, callback) {
     Document.create(document, callback);
 };

 // update
 module.exports.updateDocument = function(id, document, options, callback){
     var query = {_id: id};
     var update = {
         first_name: document.first_name,
         last_name: document.last_name,
         email: document.email,
         password: document.password
     };
     Document.findOneAndUpdate(query, update, options, callback);
 };

 // delete
 module.exports.removeDocument = function(id, callback){
     var query = {_id: id};
     Document.remove(query, callback);
 };