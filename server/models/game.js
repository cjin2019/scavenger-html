const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    huntId: String,
    creatorId: String,
    orderHuntItemIds: [String],
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
