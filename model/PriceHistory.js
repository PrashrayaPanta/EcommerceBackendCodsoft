const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PriceHistory = mongoose.model("PriceHistory", priceHistorySchema);

module.exports = PriceHistory;
