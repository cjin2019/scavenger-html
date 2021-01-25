const mongoose = require("mongoose");

const AvatarSchema = new mongoose.Schema({
    userId: String,
    color: String,
    points: Number, 
});

// compile model from schema
module.exports = mongoose.model("avatar", AvatarSchema);
