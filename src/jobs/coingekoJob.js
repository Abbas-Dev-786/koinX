const axios = require("axios");
const cron = require("node-cron");
const Crypto = require("../models/cryptoModel");
const { COINS, CURRENCY } = require("../constants");

const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: Object.values(COINS).join(","),
          vs_currencies: CURRENCY,
          include_market_cap: true,
          include_24hr_change: true,
        },
        headers: {
          "x-cg-demo-api-key": "CG-4Qt3x3bJmPfYzZXCzvYDhLvW	",
        },
      }
    );

    const data = response.data;
    const coins = Object.keys(response.data);
    const cryptoData = coins.map((coin) => ({
      coinId: coin,
      price: data[coin].usd,
      marketCap: data[coin].usd_market_cap,
      change24h: data[coin].usd_24h_change,
    }));

    await Crypto.insertMany(cryptoData); // Save data for all three coins in one operation
    console.log("Crypto data added successfully.");
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
  }
};

// Schedule this function to run every 2 hours using a scheduler like node-cron.
cron.schedule("* * * * *", fetchCryptoData);
