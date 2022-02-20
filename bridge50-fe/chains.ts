import type { AddEthereumChainParameter } from "@web3-react/types";

const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

const MATIC: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
  1: {
    urls: [
      process.env.infuraKey
        ? `https://mainnet.infura.io/v3/${process.env.infuraKey}`
        : "",
      process.env.alchemyKey
        ? `https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyKey}`
        : "",
      "https://cloudflare-eth.com",
    ].filter((url) => url !== ""),
    name: "Mainnet",
  },
  3: {
    urls: [
      process.env.infuraKey
        ? `https://ropsten.infura.io/v3/${process.env.infuraKey}`
        : "",
    ].filter((url) => url !== ""),
    name: "Ropsten",
  },
  4: {
    urls: [
      process.env.infuraKey
        ? `https://rinkeby.infura.io/v3/${process.env.infuraKey}`
        : "",
    ].filter((url) => url !== ""),
    name: "Rinkeby",
  },
  5: {
    urls: [
      process.env.infuraKey
        ? `https://goerli.infura.io/v3/${process.env.infuraKey}`
        : "",
    ].filter((url) => url !== ""),
    name: "Görli",
  },
  42: {
    urls: [
      process.env.infuraKey
        ? `https://kovan.infura.io/v3/${process.env.infuraKey}`
        : "",
    ].filter((url) => url !== ""),
    name: "Kovan",
  },
  // Optimism
  10: {
    urls: [
      process.env.infuraKey
        ? `https://optimism-mainnet.infura.io/v3/${process.env.infuraKey}`
        : "",
      "https://mainnet.optimism.io",
    ].filter((url) => url !== ""),
    name: "Optimistic Ethereum",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  69: {
    urls: [
      process.env.infuraKey
        ? `https://optimism-kovan.infura.io/v3/${process.env.infuraKey}`
        : "",
      "https://kovan.optimism.io",
    ].filter((url) => url !== ""),
    name: "Optimistic Kovan",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
  },
  // Arbitrum
  42161: {
    urls: [
      process.env.infuraKey
        ? `https://arbitrum-mainnet.infura.io/v3/${process.env.infuraKey}`
        : "",
      "https://arb1.arbitrum.io/rpc",
    ].filter((url) => url !== ""),
    name: "Arbitrum One",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://arbiscan.io"],
  },
  421611: {
    urls: [
      process.env.infuraKey
        ? `https://arbitrum-rinkeby.infura.io/v3/${process.env.infuraKey}`
        : "",
      "https://rinkeby.arbitrum.io/rpc",
    ].filter((url) => url !== ""),
    name: "Arbitrum Testnet",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://testnet.arbiscan.io"],
  },
  // Polygon
  137: {
    urls: [
      process.env.infuraKey
        ? `https://polygon-mainnet.infura.io/v3/${process.env.infuraKey}`
        : "",
      "https://polygon-rpc.com",
    ].filter((url) => url !== ""),
    name: "Polygon Mainnet",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  80001: {
    urls: [
      process.env.infuraKey
        ? `https://polygon-mumbai.infura.io/v3/${process.env.infuraKey}`
        : "",
    ].filter((url) => url !== ""),
    name: "Polygon Mumbai",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },

  43114: {
    urls: ["https://api.avax.network/ext/bc/C/rpc"],
    name: "Avalanche Mainnet",
  },

  43113: {
    urls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    name: "Avalanche Fuji Testnet",
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
  },

  250: {
    urls: ["https://rpc.ftm.tools/"],
    name: "Fantom Opera",
  },

  4002: {
    urls: ["https://rpc.testnet.fantom.network"],
    name: "Fantom Testnet",
  },

  56: {
    urls: ["https://bsc-dataseed.binance.org/"],
    name: "BSC Mainet",
  },

  97: {
    urls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    name: "BSC Testnet",
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
};

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
