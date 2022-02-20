/* eslint-disable prettier/prettier */
const app = require("express")();
require("dotenv").config();
// const { ethers } = require("ethers");
// const BRIDGE = require("./abi/Bridge.json");

// const ERC20 = require("./abi/ERC20.json");

const { avalancheWorker, bscWorker } = require("./bridgeWorkers");

// const provider = new ethers.providers.JsonRpcProvider(
//   "https://api.avax-test.network/ext/bc/C/rpc"
// );

// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// signer
//   .getBalance()
//   .then((balance) => console.log(ethers.utils.formatEther(balance)));

// const bridge = new ethers.Contract(
//   "0xe5C225F60C128B5f178048DD03a0Ff1C95946444",
//   BRIDGE.abi,
//   provider
// );

// const token = new ethers.Contract(
//   "0x5bAc93cdcf6821aaa1133578005E63246c7fB81d",
//   ERC20.abi,
//   provider
// );

// token.on("Transfer", async (from, to, amount) => {
//   console.log(`Transfer from ${from} to ${to} amount ${amount}`);
// });

// bridge.on(
//   "TokenMovedToBridge",
//   async (from, tokenAddress, amount, nonce, signature) => {
//     console.log(
//       `"Avalanche": TokenMovedToBridge from ${from} tokenAddress ${tokenAddress} amount ${amount} nonce ${nonce} signature ${signature}`
//     );
//   }
// );

avalancheWorker();
bscWorker();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
