const mongoose = require("mongoose");

const FilterHuntSchema = new mongoose.Schema({
    userId: String,
    recentIds: [String],
});

// compile model from schema
module.exports = mongoose.model("filterhunt", FilterHuntSchema);
