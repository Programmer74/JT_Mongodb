 var mongoose = require('mongoose');

// Profile schema
 var profileSchema = mongoose.Schema({
     first_name: {
         type: String,
         required: [true, 'First name required'],
         validate: {
             validator: function(v) {
                 return /^[A-Z][a-z]+$/.test(v);
             },
             message: '{VALUE} is not a valid first name!'
         }
     },
     last_name: {
         type: String,
         required: [true, 'Last name required'],
         validate: {
             validator: function(v) {
                 return /^[A-Z][a-z]+$/.test(v);
             },
             message: '{VALUE} is not a valid last name!'
         }
     },
     email: {
         type: String,
         required: [true, 'Email required'],
         unique: [true, 'Email must be unique'],
         validate: {
             validator: function(v) {
                 return /^[a-zA-Z0-9]{1,}@[a-z]{3,}\.[a-z]{2,}$/.test(v);
             },
             message: '{VALUE} is not a valid email!'
         }
     },
     password: {
         type: String,
         minlength: 6,
         required: [true, 'Password required']
     }
 },

     {
         versionKey: false
     });

 var Profile = module.exports = mongoose.model('Profile', profileSchema, 'profile');

 // get profile
 module.exports.getProfile = function(callback, limit) {
     Profile.find(callback).limit(limit);
 };

 // read by Id
 module.exports.getProfileById = function(id, callback) {
     Profile.findById(id, callback);
 };

 // add profile
 module.exports.addProfile = function(profile, callback) {
     Profile.create(profile, callback);
 };

 // update
 module.exports.updateProfile = function(id, profile, options, callback){
     var query = {_id: id};
     var update = {
         first_name: profile.first_name,
         last_name: profile.last_name,
         email: profile.email,
         password: profile.password
     };
     Profile.findOneAndUpdate(query, update, options, callback);
 };

 // delete
 module.exports.removeProfile = function(id, callback){
     var query = {_id: id};
     Profile.remove(query, callback);
 };

 // get profile by Main
 module.exports.getProfileByMail = function(mail, callback) {
     var query = Profile.findOne({'email': mail}).exec(callback);
 };