const mongoose = require("mongoose");

const testSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		premium: {
			type: Boolean,
			default: false
		},
		daily: {
			type: Number,
		},
		premiumLevel: {
			type: Number,
			required: true,
			default: 0
		},
	},
	{ timestamps: true },
);

const Test = mongoose.model("test", testSchema);

module.exports = Test;
