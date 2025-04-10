var mongoose = require("mongoose");
const Schema = mongoose.Schema;


const answersScheme = new Schema({
	userID: Number,
	questionID: Number,
	choiceID: Number,
	datetime: Date,
	admin: Boolean
})


module.exports = mongoose.model("Answer", answersScheme);
