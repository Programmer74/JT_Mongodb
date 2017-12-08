 var mongoose = require('mongoose');

// Picture schema
 var pictureSchema = mongoose.Schema({
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
     },
     tags: {
         type: String,
         minlength: 3,
         validate: {
             validator: function(v) {
                 return /^[a-zA-Z0-9,]*$/.test(v);
             },
             message: '{VALUE} are not valid tags!'
         }
     }
 },
     {
         versionKey: false
     });

 var Picture = module.exports = mongoose.model('Picture', pictureSchema, 'picture');

 // get picture
 module.exports.getPicture = function(callback, limit) {
     Picture.find(callback).limit(limit);
 };

 // read by Id
 module.exports.getPictureById = function(id, callback) {
     Picture.findById(id, callback);
 };

 // add picture
 module.exports.addPicture = function(picture, callback) {
     Picture.create(picture, callback);
 };

 // update
 module.exports.updatePicture = function(id, picture, options, callback){
     var query = {_id: id};
     var update = {
         url: document.url,
         description: document.description
     };
     Picture.findOneAndUpdate(query, update, options, callback);
 };

 // delete
 module.exports.removePicture = function(id, callback){
     var query = {_id: id};
     Picture.remove(query, callback);
 };