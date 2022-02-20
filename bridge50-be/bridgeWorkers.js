/* eslint-disable prettier/prettier */
const { ethers } = require("ethers");
require("dotenv").config();
const { avalancheProvider, bscProvider } = require("./providers");
const BRIDGE = require("./abi/Bridge.json");

const AVALANCHE_BRIDGE = "0xe5C225F60C128B5f178048DD03a0Ff1C95946444";

const BSC_BRIDGE = "0x5bAc93cdcf6821aaa1133578005E63246c7fB81d";

const forwardWorker = async (
  fromProvider,
  toProvider,
  fromBridgeAddress,
  toBridgeAddress,
  fromName,
  toName
) => {
  console.log(`${fromName} worker is getting started...`);

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, toProvider);

  const fromBridge = new ethers.Contract(
    fromBridgeAddress,
    BRIDGE.abi,
    fromProvider
  );

  const toBridge = new ethers.Contract(toBridgeAddress, BRIDGE.abi, toProvider);

  console.log(`${fromName} BRIDGE: ${fromBridge.address}`);
  console.log(`${toName} BRIDGE: ${toBridge.address}`);

  console.log(`${fromName} worker ready!`);

  // event TokenMovedToBridge(
  //       address indexed from,
  //       address tokenAddress,
  //       uint256 amount,
  //       uint256 nonce,
  //       bytes signature
  // );

  fromBridge.on(
    "TokenMovedToBridge",
    async (from, tokenAddress, amount, nonce, signature) => {
      console.log(
        `${fromName}: TokenMovedToBridge from ${from} tokenAddress ${tokenAddress} amount ${amount} nonce ${nonce} signature ${signature}`
      );
      const tx = await toBridge
        .connect(signer)
        .bridgeTransferExactToken(from, tokenAddress, amount, nonce, signature);
      console.log(
        `${fromName} - ${toName}: TokenMovedToBridge from ${from} Forwarding tx ${tx.hash}`
      );
    }
  );

  // event TokenMovedToUser(
  //       address indexed to,
  //       address tokenAddress,
  //       uint256 amount,
  //       uint256 nonce,
  //       bytes signature
  // );

  toBridge.on(
    "TokenMovedToUser",
    async (to, tokenAddress, amount, nonce, signature) => {
      console.log(
        `${toName}: TokenMovedToUser to ${to} tokenAddress ${tokenAddress} amount ${amount} nonce ${nonce} signature ${signature}`
      );
    }
  );
};

const avalancheWorker = () =>
  forwardWorker(
    avalancheProvider,
    bscProvider,
    AVALANCHE_BRIDGE,
    BSC_BRIDGE,
    "Avalanche",
    "BSC"
  );

const bscWorker = () =>
  forwardWorker(
    bscProvider,
    avalancheProvider,
    BSC_BRIDGE,
    AVALANCHE_BRIDGE,
    "BSC",
    "Avalanche"
  );

module.exports = {
  avalancheWorker,
  bscWorker,
};
