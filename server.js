var express = require('express');
var app = express();
//var mongojs = require('mongojs');
var mongoose = require('mongoose');
//var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser');

var port = process.env.PORT || 5000;

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring = 
process.env.MONGOLAB_URI || 
process.env.MONGOHQ_URL ||
'mongodb://localhost/contactlist';

mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log('ERROR connecting to: ' + uristring + ', ' + err);
	} else {
		console.log('Succeeded connected to: ' + uristring);
	}
});

var clientSchema = new mongoose.Schema({
	name: String,
	company: String,
	email: String,
	phone: String
});

var Client = mongoose.model('contactlist', clientSchema);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/contactlist', function (req, res) {
	console.log("GET request was received");

	/*db.contactlist.find(function (err, docs) {
		console.log(docs);
		res.json(docs);
	});*/
	Client.find(function (err, docs) {
		if (err) return console.error(err);
		console.log(docs);
		res.json(docs);
	});
});

app.post('/contactlist', function (req, res) {
	console.log(req.body);
	/*db.contactlist.insert(req.body, function (err, doc) {
		res.json(doc);
	});*/
	var contact = new Client({
		name: req.body.name,
		company: req.body.company,
		email: req.body.email,
		phone: req.body.phone
	})
	contact.save(function (err, doc) {
		if (err) console.log(err);
		else {
			console.log('Saved: ' + doc + ' on ' + uristring);
			res.json(doc);
		}
	});
});

app.delete('/contactlist/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	/*db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});*/
	Client.remove({_id: mongoose.Types.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

app.get('/contactlist/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	/*db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});*/
	Client.findOne({_id: mongoose.Types.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

app.put('/contactlist/:id', function (req, res) {
	var id = req.params.id;
	console.log("Updated" + req.body.name);
	/*db.contactlist.findAndModify({
		query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, company: req.body.company, email: req.body.email, phone: req.body.phone}},
		new: true}, function (err, doc) {
			res.json(doc);
		}
	);*/
	Client.findByIdAndUpdate(id, 
		{$set: {name: req.body.name, company: req.body.company, email: req.body.email, phone: req.body.phone}},
		function (err, doc) {
			res.json(doc);
		});
});

app.listen(port);
console.log("Server running on port " + port);