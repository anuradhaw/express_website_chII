var mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
	name: String,
	email: String,
	phone: Number
});

mongoose.model('Client',clientSchema);