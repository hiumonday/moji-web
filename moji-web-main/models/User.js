const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	goal:{
		type: String,
	},
	aim:{
		type: String
	},
	email: {
		type: String,
	},
	provider: {
		type: String,
		enum: ["facebook", "google"],
		required: true
	},
	googleId: {
		type: String,
	},
	facebookId: {
		type: String,
	},
	role: {
		type: String,
		required: true,
		default: "user"
	},
	takenTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }],
	isReferred: {
		type: Boolean,
		default: false
	},
	referralUsageCount: {
		type: Number,
		default: 0,
		required: true
	},

}, {timestamps: true});

//Generate Authentication Token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

const User = mongoose.model("user", userSchema);

module.exports = User;
