require("mongoose");

const PlayerSchema = new mongoose.Schema({
    gameId: String,
    userInfo: {
        _id: String,
        name: String,
    },
    currentHuntItemIndex: Number,
    numCorrect: Number
});

// compile model from schema
module.exports = mongoose.model("player", PlayerSchema);