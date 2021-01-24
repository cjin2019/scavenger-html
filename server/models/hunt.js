const mongoose = require("mongoose");

const HuntSchema = new mongoose.Schema({
    creatorId: String,
    title: String,
    description: String,
    isFinalized: Boolean,
    isTutorial: Boolean,
});

// compile model from schema
module.exports = mongoose.model("hunt", HuntSchema);
