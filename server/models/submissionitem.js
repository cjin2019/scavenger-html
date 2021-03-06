const mongoose = require("mongoose");

const SubmissionItemSchema = new mongoose.Schema({
    huntItemId: String,
    playerId: String,
    gameId: String,
    currentSubmission: String,
    numSubmissions: Number,
    isCorrect: Boolean,
});

// compile model from schema
module.exports = mongoose.model("submissionitem", SubmissionItemSchema);
