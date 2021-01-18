const mongoose = require("mongoose");

//for now question and answer are strings later going to be more advanced
const HuntItemSchema = new mongoose.Schema({
    huntId: String,
    question: String,
    answer: String
});

// compile model from schema
module.exports = mongoose.model("huntitem", HuntItemSchema);
