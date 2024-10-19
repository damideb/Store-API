const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: String,
  image: String,
  countInstock: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
