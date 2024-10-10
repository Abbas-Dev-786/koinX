const mongoose = require("mongoose");
const { COINS } = require("../constants");

const cryptoSchema = new mongoose.Schema(
  {
    coinId: {
      type: String,
      required: [true, "coinId is required"],
      enum: {
        values: Object.values(COINS),
        message: `coinId must be either ${Object.values(ROLES).join(", ")}.`,
      },
    },
    price: { type: Number, required: [true, "price is required"] },
    marketCap: { type: Number, required: [true, "marketCap is required"] },
    change24h: { type: Number, required: [true, "change24h is required"] },
  },
  { timestamps: true }
);

cryptoSchema.index({ coinId: 1 });

const Crypto = mongoose.model("Crypto", cryptoSchema);
module.exports = Crypto;
