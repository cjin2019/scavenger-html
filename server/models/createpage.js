const mongoose = require("mongoose");

const CreatePageSchema = new mongoose.Schema({
    userId: String,
});

// compile model from schema
module.exports = mongoose.model("createpage", CreatePageSchema);
