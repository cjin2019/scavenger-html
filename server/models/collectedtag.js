const mongoose = require("mongoose");

const CollectedTagSchema = new mongoose.Schema({
    huntItemId: String,
    userId: String,
    tag: String
});

// compile model from schema
module.exports = mongoose.model("collectedtag", CollectedTagSchema);
