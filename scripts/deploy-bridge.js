const hre = require("hardhat");

async function main() {
  const Bridge = await hre.ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy();

  await bridge.deployed();

  console.log("bridge deployed to:", bridge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
