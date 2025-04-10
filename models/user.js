var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
	userID: Number,
	datetime: Date
});

module.exports =  mongoose.model("User", userScheme);