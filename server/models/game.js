const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
    huntId: String,
    orderHuntItemIds: Array,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
