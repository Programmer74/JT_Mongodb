var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// setting up redis
var redis = require('redis');
var client = redis.createClient();

// set cache interval
const CACHE_INTERVAL = 10000;

// setting directory for front
app.use(express.static(__dirname + '/client'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(bodyParser.json({type: 'application/json'}));

// models
Profile = require('./models/profile');
Document = require('./models/document');
Picture = require('./models/picture');
Attachment = require('./models/attachment');

// operations
var cacheOp = require('./modules/cacheOperations');

// Connect to mongoose
mongoose.connect('mongodb://localhost:27017/jtmongodb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected");
});

/* ====================================== PROFILES =============================================*/
// get all profiles
app.get('/api/profile', function(req, res) {
    console.log(">> Sending profiles...");
    Profile.getProfile(function(err, profile){
        if (err) {
            console.error(">> Error finding profile");
            res.status(500).send({ error: 'Listing profiles failed!' });
        }
        res.json(profile);
    })
});

//get profile by id
app.get('/api/profile/:_id', function (req, res) {
    console.log("> Requested profile by id...");
    var id = req.params._id;

    client.get(id, function(err, result) {
        if (err) console.log('Error searching cache');
        if (!isEmptyObject(result)) { // search in cache
            console.log('>> Found in cache');
            res.json(JSON.parse(result));
        } else { // if not in cache
            console.log('>> Empty in cache. Finding in DB...');
            Profile.getProfileById(id, function (err, profile) {
                if (err) {
                    console.error(">> Error finding profiles");
                    res.status(500).send({error: 'Profile by ID failed!'});
                } else { // add to cache
                    console.log('>> Found in DB');
                    //client.setex(id, CACHE_INTERVAL, JSON.stringify(store));
                    if (!isEmptyObject(profile)) {
                        cacheOp.setCache(client, profile, CACHE_INTERVAL);
                        res.json(profile);
                    }
                }
            });
        }
    });
});

// creating profile
app.post('/api/profile', function (req, res) {
    var profile = req.body;
    console.log('> Creating profile');
    Profile.addProfile(profile, function(err, profile){
        if (err) {
            console.error(">> Error posting profiles", err);
            res.status(500).send({ error: 'Posting profile failed!' });
        } else {
            console.log(">> Profile is set to cache: ", profile.toString());
            //client.setex(store1._id, CACHE_INTERVAL, JSON.stringify(store1)); // save the new store to cache
            cacheOp.setCache(client, profile, CACHE_INTERVAL);
            res.json(profile);
        }
    });
});

// updating profile
app.put('/api/profile/:_id', function(req, res) {
    var id = req.params._id;
    var profile = req.body;
    console.log('> Creating profile');
    Profile.updateProfile(id, profile, {}, function(err, profile){
        if (err) {
            console.error(">> Error updating profile" + err);
            res.status(500).send({ error: 'Updating profile failed!' });
        } else {
            console.log(">> Profile is updated in cache", profile);
            //client.setex(store._id, CACHE_INTERVAL, JSON.stringify(store)); // save the new store to cache
            cacheOp.deleteCache(client, id);
            res.json(profile);
        }
    })
});

// deleting profile
app.delete('/api/profile/:_id', function(req, res) {
    var id = req.params._id;
    console.log('> Trying to delete profile: ', id);
    Profile.removeProfile(id, function(err, profile) {
        if (err) {
            console.error(">> Error deleting profile", err);
            res.status(500).send({ error: 'Deleting profile failed!' });
        } else {
            // delete cache
            cacheOp.deleteCache(profile, id);
            res.json(profile);
        }
    })
});

/* ====================================== DOCUMENTS =============================================*/
// get all documents
app.get('/api/document', function(req, res) {
    console.log(">> Sending documents...");
    Document.getDocument(function(err, document){
        if (err) {
            console.error(">> Error finding documents");
            res.status(500).send({ error: 'Listing document failed!' });
        }
        res.json(document);
    })
});

//get document by id
app.get('/api/document/:_id', function (req, res) {
    console.log("> Requested document by id...");
    var id = req.params._id;

    client.get(id, function(err, result) {
        if (err) console.log('Error searching cache');
        if (!isEmptyObject(result)) { // search in cache
            console.log('>> Found in cache');
            res.json(JSON.parse(result));
        } else { // if not in cache
            console.log('>> Empty in cache. Finding in DB...');
            Document.getDocumentById(id, function (err, document) {
                if (err) {
                    console.error(">> Error finding documents");
                    res.status(500).send({error: 'Document by ID failed!'});
                } else { // add to cache
                    console.log('>> Found in DB');
                    //client.setex(id, CACHE_INTERVAL, JSON.stringify(store));
                    if (!isEmptyObject(document)) {
                        cacheOp.setCache(client, document, CACHE_INTERVAL);
                        res.json(document);
                    }
                }
            });
        }
    });
});

// creating document
app.post('/api/document', function (req, res) {
    var document = req.body;
    console.log('> Creating document');
    Document.addDocument(document, function(err, document){
        if (err) {
            console.error(">> Error posting documents", err);
            res.status(500).send({ error: 'Posting documents failed!' });
        } else {
            console.log(">> Document is set to cache: ", document.toString());
            //client.setex(store1._id, CACHE_INTERVAL, JSON.stringify(store1)); // save the new store to cache
            cacheOp.setCache(client, document, CACHE_INTERVAL);
            res.json(document);
        }
    });
});

// updating document
app.put('/api/document/:_id', function(req, res) {
    var id = req.params._id;
    var document = req.body;
    console.log('> Creating document');
    Document.updateDocument(id, document, {}, function(err, document){
        if (err) {
            console.error(">> Error updating document" + err);
            res.status(500).send({ error: 'Updating document failed!' });
        } else {
            console.log(">> Document is updated in cache", document);
            //client.setex(store._id, CACHE_INTERVAL, JSON.stringify(store)); // save the new store to cache
            cacheOp.deleteCache(client, id);
            res.json(document);
        }
    })
});

// deleting document
app.delete('/api/document/:_id', function(req, res) {
    var id = req.params._id;
    console.log('> Trying to delete document: ', id);
    Document.removeDocument(id, function(err, document) {
        if (err) {
            console.error(">> Error deleting document", err);
            res.status(500).send({ error: 'Deleting document failed!' });
        } else {
            // delete cache
            cacheOp.deleteCache(document, id);
            res.json(document);
        }
    })
});

/* ====================================== PICTURES =============================================*/
// get all pictures
app.get('/api/picture', function(req, res) {
    console.log(">> Sending pictures...");
    Picture.getPicture(function(err, picture){
        if (err) {
            console.error(">> Error finding pictures");
            res.status(500).send({ error: 'Listing pictures failed!' });
        }
        res.json(picture);
    })
});

//get picture by id
app.get('/api/picture/:_id', function (req, res) {
    console.log("> Requested picture by id...");
    var id = req.params._id;

    client.get(id, function(err, result) {
        if (err) console.log('Error searching cache');
        if (!isEmptyObject(result)) { // search in cache
            console.log('>> Found in cache');
            res.json(JSON.parse(result));
        } else { // if not in cache
            console.log('>> Empty in cache. Finding in DB...');
            Picture.getPictureById(id, function (err, picture) {
                if (err) {
                    console.error(">> Error finding pictures");
                    res.status(500).send({error: 'Picture by ID failed!'});
                } else { // add to cache
                    console.log('>> Found in DB');
                    //client.setex(id, CACHE_INTERVAL, JSON.stringify(store));
                    if (!isEmptyObject(picture)) {
                        cacheOp.setCache(client, picture, CACHE_INTERVAL);
                        res.json(picture);
                    }
                }
            });
        }
    });
});

// creating picture
app.post('/api/picture', function (req, res) {
    var picture = req.body;
    console.log('> Creating picture');
    Picture.addPicture(picture, function(err, picture){
        if (err) {
            console.error(">> Error posting pictures", err);
            res.status(500).send({ error: 'Posting pictures failed!' });
        } else {
            console.log(">> Picture is set to cache: ", picture.toString());
            //client.setex(store1._id, CACHE_INTERVAL, JSON.stringify(store1)); // save the new store to cache
            cacheOp.setCache(client, picture, CACHE_INTERVAL);
            res.json(picture);
        }
    });
});

// updating picture
app.put('/api/picture/:_id', function(req, res) {
    var id = req.params._id;
    var picture = req.body;
    console.log('> Creating picture');
    Picture.updatePicture(id, picture, {}, function(err, picture){
        if (err) {
            console.error(">> Error updating picture" + err);
            res.status(500).send({ error: 'Updating picture failed!' });
        } else {
            console.log(">> Picture is updated in cache", picture);
            //client.setex(store._id, CACHE_INTERVAL, JSON.stringify(store)); // save the new store to cache
            cacheOp.deleteCache(client, id);
            res.json(picture);
        }
    })
});

// deleting picture
app.delete('/api/picture/:_id', function(req, res) {
    var id = req.params._id;
    console.log('> Trying to delete picture: ', id);
    Picture.removePicture(id, function(err, picture) {
        if (err) {
            console.error(">> Error deleting picture", err);
            res.status(500).send({ error: 'Deleting picture failed!' });
        } else {
            // delete cache
            cacheOp.deleteCache(picture, id);
            res.json(picture);
        }
    })
});

/* ====================================== ATTACHMENTS =============================================*/
// get all attachments
app.get('/api/attachment', function(req, res) {
    console.log(">> Sending attachments...");
    Attachment.getAttachment(function(err, attachment){
        if (err) {
            console.error(">> Error finding attachments");
            res.status(500).send({ error: 'Listing attachments failed!' });
        }
        res.json(attachment);
    })
});

//get attachment by id
app.get('/api/attachment/:_id', function (req, res) {
    console.log("> Requested attachment by id...");
    var id = req.params._id;

    client.get(id, function(err, result) {
        if (err) console.log('Error searching cache');
        if (!isEmptyObject(result)) { // search in cache
            console.log('>> Found in cache');
            res.json(JSON.parse(result));
        } else { // if not in cache
            console.log('>> Empty in cache. Finding in DB...');
            Attachment.getAttachmentById(id, function (err, attachment) {
                if (err) {
                    console.error(">> Error finding attachments");
                    res.status(500).send({error: 'Attachment by ID failed!'});
                } else { // add to cache
                    console.log('>> Found in DB');
                    //client.setex(id, CACHE_INTERVAL, JSON.stringify(store));
                    if (!isEmptyObject(attachment)) {
                        cacheOp.setCache(client, attachment, CACHE_INTERVAL);
                        res.json(attachment);
                    }
                }
            });
        }
    });
});

// creating attachment
app.post('/api/attachment', function (req, res) {
    var attachment = req.body;
    console.log('> Creating attachment');

    // check that the staff exists by their email
    if (attachment.type.localeCompare("document") == 0) {
        Document.getDocumentById(attachment.attachmentid, function(err, document) {
            if (err) {
                console.error(">>> No attachment (document) found by id " + attachment.type);
                valid = false;
            } else {
                console.log(">>> Attachment (document) found by id " + attachment.type);

                Attachment.addAttachment(attachment, function(err, attachment){
                    if (err) {
                        console.error(">> Error posting attachments", err);
                        res.status(500).send({ error: 'Posting attachments failed!' });
                    } else {
                        console.log(">> Attachment is set to cache: ", attachment.toString());
                        //client.setex(store1._id, CACHE_INTERVAL, JSON.stringify(store1)); // save the new store to cache
                        cacheOp.setCache(client, attachment, CACHE_INTERVAL);
                        res.json(attachment);
                    }
                });
            }
        });
    } else if (attachment.type.localeCompare("picture") == 0) {
        Picture.getPictureById(attachment.attachmentid, function(err, picture) {
            if (err) {
                console.error(">>> No attachment (picture) found by id " + attachment.type);
                valid = false;
            } else {
                console.log(">>> Attachment (picture) found by id " + attachment.type);

                Attachment.addAttachment(attachment, function(err, attachment){
                    if (err) {
                        console.error(">> Error posting attachments", err);
                        res.status(500).send({ error: 'Posting attachments failed!' });
                    } else {
                        console.log(">> Attachment is set to cache: ", attachment.toString());
                        //client.setex(store1._id, CACHE_INTERVAL, JSON.stringify(store1)); // save the new store to cache
                        cacheOp.setCache(client, attachment, CACHE_INTERVAL);
                        res.json(attachment);
                    }
                });
            }
        });
    }
});

// updating attachment
app.put('/api/attachment/:_id', function(req, res) {
    var id = req.params._id;
    var attachment = req.body;

    // check that the staff exists by their email
    if (attachment.type.localeCompare("document")) {
        Document.getDocumentById(attachment.attachmentid, function(err, document) {
            if (err) {
                console.error(">>> No attachment (document) found by id " + attachment.type);
                valid = false;
            } else {
                console.log(">>> Attachment (document) found by id " + attachment.type);
                console.log('> Creating attachment');
                Attachment.updateAttachment(id, attachment, {}, function(err, attachment){
                    if (err) {
                        console.error(">> Error updating attachment" + err);
                        res.status(500).send({ error: 'Updating attachment failed!' });
                    } else {
                        console.log(">> Attachment is updated in cache", attachment);
                        //client.setex(store._id, CACHE_INTERVAL, JSON.stringify(store)); // save the new store to cache
                        cacheOp.deleteCache(client, id);
                        res.json(attachment);
                    }
                })
            }
        });
    } else if (attachment.type.localeCompare("picture")) {
        Picture.getPictureById(attachment.attachmentid, function(err, picture) {
            if (err) {
                console.error(">>> No attachment (picture) found by id " + attachment.type);
                valid = false;
            } else {
                console.log(">>> Attachment (picture) found by id " + attachment.type);
                console.log('> Creating attachment');
                Attachment.updateAttachment(id, attachment, {}, function(err, attachment){
                    if (err) {
                        console.error(">> Error updating attachment" + err);
                        res.status(500).send({ error: 'Updating attachment failed!' });
                    } else {
                        console.log(">> Attachment is updated in cache", attachment);
                        //client.setex(store._id, CACHE_INTERVAL, JSON.stringify(store)); // save the new store to cache
                        cacheOp.deleteCache(client, id);
                        res.json(attachment);
                    }
                })
            }
        });
    }

});

// deleting attachment
app.delete('/api/attachment/:_id', function(req, res) {
    var id = req.params._id;
    console.log('> Trying to delete attachment: ', id);
    Attachment.removeAttachment(id, function(err, attachment) {
        if (err) {
            console.error(">> Error deleting attachment", err);
            res.status(500).send({ error: 'Deleting store failed!' });
        } else {
            // delete cache
            cacheOp.deleteCache(attachment, id);
            res.json(attachment);
        }
    })
});

// detect if our json value is null
function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

app.listen(3000);
console.log('Running on port 3000...');

module.exports = app;