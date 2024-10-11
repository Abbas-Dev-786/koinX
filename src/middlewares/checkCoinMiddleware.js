const { COINS } = require("../constants");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

module.exports.checkCoin = catchAsync(async (req, res, next) => {
  const { coin } = req.query;
  const allowedCoins = Object.values(COINS);

  if (!coin) {
    return next(new AppError("coin query param is required", 400));
  }

  if (!allowedCoins.includes(coin)) {
    return next(
      new AppError(
        `Coin does not exists. It can be ${allowedCoins.join(", ")}`,
        400
      )
    );
  }

  next();
});
