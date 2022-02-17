require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      gas: 120000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/8918959b567c47418752523f7b91a9cc",
      accounts: [
        "a6bd9fa520a4bc25f40baac061f038188db7b1f16703493f5dd5453bfb399dff",
      ],
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
    ethMainnet: {
      url: "",
      accounts: [],
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gas: 120000000,
      // gasPrice: 225000000000,
      chainId: 43113,
      accounts: [
        "a6bd9fa520a4bc25f40baac061f038188db7b1f16703493f5dd5453bfb399dff",
      ],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",

      chainId: 43114,
      accounts: [],
    },

    fantomOpera: {
      url: "https://rpc.ftm.tools",
      chainId: 250,
      accounts: [],
    },

    fantomTest: {
      url: "https://rpc.testnet.fantom.network",
      chainId: 4002,
      accounts: [
        "a6bd9fa520a4bc25f40baac061f038188db7b1f16703493f5dd5453bfb399dff",
      ],
      blockGasLimit: 10000000000,
      // gas: 2100000,
      // gasPrice: 8000000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
