require("mongoose");

const PlayerSchema = new mongoose.Schema({
    gameId: String,
    userId: String,
    userName: String,
    currentHuntItemIndex: Number,
});

// compile model from schema
module.exports = mongoose.model("player", PlayerSchema);