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
            console.error(">> Error finding stores");
            res.status(500).send({ error: 'Listing stores failed!' });
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
            console.error(">> Error posting stores", err);
            res.status(500).send({ error: 'Posting stores failed!' });
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
            console.error(">> Error deleting store", err);
            res.status(500).send({ error: 'Deleting store failed!' });
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
            res.status(500).send({ error: 'Listing stores failed!' });
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
            console.error(">> Error posting stores", err);
            res.status(500).send({ error: 'Posting stores failed!' });
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
            console.error(">> Error deleting store", err);
            res.status(500).send({ error: 'Deleting store failed!' });
        } else {
            // delete cache
            cacheOp.deleteCache(document, id);
            res.json(document);
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