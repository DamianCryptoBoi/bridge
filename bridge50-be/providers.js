/* eslint-disable prettier/prettier */
const { ethers } = require("ethers");
require("dotenv").config();

const provider = (url) => new ethers.providers.JsonRpcProvider(url);

const avalancheProvider = provider(process.env.AVALANCHE_URL);

const bscProvider = provider(process.env.BSC_URL);

module.exports = {
  avalancheProvider,
  bscProvider,
};
