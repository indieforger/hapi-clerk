const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');

var subscriberSchema = new Mongoose.Schema({
	email: { type: String, unique: true, lowercase: true },
	password: { type: String, select: false },
}, {
	toObject: {
		transform: function (doc, ret) {
			delete ret.__v;
		}
	}
});

var Subscriber = module.exports = Mongoose.model('Subscriber', subscriberSchema);