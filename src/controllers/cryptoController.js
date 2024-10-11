const { COINS } = require("../constants");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
const Crypto = require("./../models/cryptoModel");

module.exports.getCoinStats = catchAsync(async (req, res, next) => {
  const { coin } = req.query;

  const data = await Crypto.findOne({ coinId: coin }).sort({ createdAt: -1 });

  return res.status(200).json({
    price: data.price,
    marketCap: data.marketCap,
    "24hChange": data.change24h,
  });
});

module.exports.getStandardDeviation = catchAsync(async (req, res, next) => {
  const { coin } = req.query;

  const prices = await Crypto.find({ coinId: coin })
    .sort({ createdAt: -1 })
    .limit(100)
    .select("price");

  if (prices.length < 2) {
    return new AppError("Insufficient data to calculate deviation", 400);
  }

  const priceValues = prices.map((p) => p.price);
  const mean = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
  const variance =
    priceValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
    priceValues.length;
  const stdDeviation = Math.sqrt(variance);

  res.json({ deviation: stdDeviation.toFixed(2) });
});
