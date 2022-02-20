import React from "react";
import styles from "../styles/Home.module.css";
import { hooks, metaMask } from "../connectors/metaMask";
import { CHAINS } from "../chains";
import { useState, useEffect, useRef } from "react";
import * as ethers from "ethers";
import ERC20 from "../abi/MockToken.json";
import BRIDGE from "../abi/Bridge.json";
import contract from "web3/eth/contract";

const { useChainId, useAccounts, useProvider } = hooks;

const BSC_TESTNET_CHAINID = 97;

const AVALANCHE_FUJI_CHAINID = 43113;

const bridgeAddress = {
  [BSC_TESTNET_CHAINID]: "0x5bAc93cdcf6821aaa1133578005E63246c7fB81d",
  [AVALANCHE_FUJI_CHAINID]: "0xe5C225F60C128B5f178048DD03a0Ff1C95946444",
};

const tokenAddress = {
  [BSC_TESTNET_CHAINID]: "0x69bCeea411763C493d048f003a78583f1dabA4Ca",
  [AVALANCHE_FUJI_CHAINID]: "0x5bAc93cdcf6821aaa1133578005E63246c7fB81d",
};

const MAX_UINT256 =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const Bridge = () => {
  const chainId = useChainId();
  const provider = useProvider();
  const accounts = useAccounts();
  const [fromChain, setFromChain] = useState<number>();
  const [toChain, setToChain] = useState<number>();
  const [mtkBalance, setMtkBalance] = useState<number | string>(0);

  const inputRef = useRef<HTMLInputElement>();

  const switchChain = () => {
    metaMask.activate(
      chainId === BSC_TESTNET_CHAINID
        ? AVALANCHE_FUJI_CHAINID
        : BSC_TESTNET_CHAINID
    );
  };

  const mintToken = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      tokenAddress[chainId],
      ERC20.abi,
      provider
    );
    const tx = await contract
      .connect(signer)
      .mint(ethers.utils.parseUnits("1000").toString());

    alert("Tx is being processed, wait for reload");
    await tx.wait();
    window.location.reload();
  };

  const approveToken = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      tokenAddress[chainId],
      ERC20.abi,
      provider
    );
    const tx = await contract
      .connect(signer)
      .approve(bridgeAddress[chainId], MAX_UINT256);

    alert("Tx is being processed, wait for reload");
    await tx.wait();
    window.location.reload();
  };

  const moveToken = async () => {
    const signer = provider.getSigner();

    const userAddress = await signer.getAddress();

    const amount =
      inputRef.current.value > 0
        ? ethers.utils.parseUnits(inputRef.current.value, 18)
        : 0;

    const contract = new ethers.Contract(
      bridgeAddress[chainId],
      BRIDGE.abi,
      provider
    );

    const nonce = await contract.connect(signer).getUserNonce();

    //  address _signer,
    //     address _tokenAddress,
    //     uint256 _amount,
    //     uint256 _nonce
    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "uint256"],
      [userAddress, tokenAddress[chainId], amount || 0, nonce]
    );

    console.log(messageHash);
    const signature = await signer.signMessage(
      ethers.utils.arrayify(messageHash)
    );

    // function moveTokenThroughBridgeForExactToken(
    //     address _tokenAddress,
    //     uint256 _amount,
    //     uint256 _nonce,
    //     bytes calldata _signature
    // )

    const tx = await contract
      .connect(signer)
      .moveTokenThroughBridgeForExactToken(
        tokenAddress[chainId],
        amount || 0,
        nonce,
        signature
      );
    alert("Tx is being processed, wait for reload");

    await tx.wait();

    window.location.reload();
  };

  const addTokenToMetaMask = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress[chainId], // The address that the token is at.
            symbol: "MTK", // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formatExplorer = (base: string, address: string) =>
    `${base}address/${address}`;

  useEffect(() => {
    const load = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
        } catch (e) {
          //User denied account access
        }
      }
      load();
    };
  }, []);

  useEffect(() => {
    setFromChain(chainId);
    setToChain(
      chainId === BSC_TESTNET_CHAINID
        ? AVALANCHE_FUJI_CHAINID
        : BSC_TESTNET_CHAINID
    );
  }, [chainId]);

  useEffect(() => {
    if (!provider || !accounts || !chainId) return;

    const contract = new ethers.Contract(
      tokenAddress[chainId],
      ERC20.abi,
      provider
    );

    contract.balanceOf(accounts[0]).then((balance: any) => {
      setMtkBalance(
        ethers.utils.formatUnits(ethers.BigNumber.from(balance), 18)
      );
    });
  }, [provider]);

  return (
    <div className={styles.bridge}>
      {!!accounts ? (
        chainId === BSC_TESTNET_CHAINID ||
        chainId === AVALANCHE_FUJI_CHAINID ? (
          <div>
            <div
              style={{
                border: "1px solid black",
                padding: "1rem",
                borderRadius: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div>Mock token(MTK) balance: {mtkBalance}</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <button onClick={mintToken}>GET 1000 MTK</button>
                <button onClick={addTokenToMetaMask}>ADD TO METAMASK</button>
              </div>
            </div>
            <input type="number" ref={inputRef} />
            <button onClick={approveToken}>Approve</button>
            <button onClick={moveToken}>Move Token</button>
            {fromChain && (
              <div>
                <p>{`From: ${CHAINS[fromChain]?.name}`}</p>
                <p>
                  Token address:{" "}
                  <a
                    href={formatExplorer(
                      CHAINS[fromChain].blockExplorerUrls[0],
                      tokenAddress[fromChain]
                    )}
                    target="_blank"
                  >
                    {tokenAddress[fromChain]}
                  </a>
                </p>
              </div>
            )}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button onClick={switchChain}>
                <img
                  src="/cycle.png"
                  style={{ width: "50px", height: "50px" }}
                />
              </button>
            </div>

            {toChain && (
              <div>
                <p>{`To: ${CHAINS[toChain]?.name}`}</p>
                <p>
                  Token address:{" "}
                  <a
                    href={formatExplorer(
                      CHAINS[toChain].blockExplorerUrls[0],
                      tokenAddress[toChain]
                    )}
                    target="_blank"
                  >
                    {tokenAddress[toChain]}
                  </a>
                </p>
              </div>
            )}
          </div>
        ) : (
          <p>Unsupported chain</p>
        )
      ) : (
        <p>Pls Connect to wallet</p>
      )}
    </div>
  );
};

export default Bridge;
