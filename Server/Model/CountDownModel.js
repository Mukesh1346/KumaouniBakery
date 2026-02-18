const mongoose = require("mongoose");

const countdownSchema = new mongoose.Schema({
    title: String, // optional
    endTime: Date, // countdown end time
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    isActive: { type: Boolean, default: true, },

}, { timestamps: true });

module.exports = mongoose.model("Countdown", countdownSchema);
