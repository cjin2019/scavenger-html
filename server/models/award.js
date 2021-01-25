const mongoose = require("mongoose");

const AwardSchema = new mongoose.Schema({
    huntId: String,
    userId: String,
    points: Number, 
});

// compile model from schema
module.exports = mongoose.model("award",AwardSchema);
