

const mongoose = require("mongoose")

const reelSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  video: { type: String, required: true },
  productImage: { type: String, required: true },
  activeOnHome: { type: Boolean, default: false },
},
  { timestamps: true })


const Reel = mongoose.model("Reel", reelSchema)

module.exports = Reel