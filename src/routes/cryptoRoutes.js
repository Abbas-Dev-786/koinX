const express = require("express");
const cryptoController = require("./../controllers/cryptoController");
const { checkCoin } = require("../middlewares/checkCoinMiddleware");

const router = express.Router();

router.use(checkCoin);

router
  .get("/stats", cryptoController.getCoinStats)
  .get("/deviation", cryptoController.getStandardDeviation);

module.exports = router;
