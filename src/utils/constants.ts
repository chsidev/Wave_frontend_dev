// import { createPublicClient, http } from 'viem'
import { mainnet, polygon, base, bscTestnet, bsc, arbitrum, avalanche, avalancheFuji } from 'viem/chains'
import Web3 from 'web3'

const isProduct = 'local'

// const PROVIDER_URL_BSC = 'https://binance.llamarpc.com'
const PROVIDER_URL_BSC = 'https://bsc.meowrpc.com'
const PROVIDER_URL_TESTBSC = 'https://bsc-testnet-rpc.publicnode.com'
const PROVIDER_URL_BASE = 'https://mainnet.base.org'
const PROVIDER_URL_POL = 'https://polygon.llamarpc.com'
const PROVIDER_URL_ETH = 'https://ethereum-rpc.publicnode.com'
const PROVIDER_URL_ARB = 'https://arbitrum.meowrpc.com'
const PROVIDER_URL_AVAX = 'https://avalanche-c-chain-rpc.publicnode.com'

export const web3ClientBsc = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL_BSC))
export const web3ClientTestBsc = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL_TESTBSC))
export const web3Client = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL_ETH))
export const baseWeb3Client = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL_BASE))
export const polWeb3Client = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL_POL))
export const arbWeb3Client = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL_ARB))
export const avaxWeb3Client = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL_AVAX))

export const web3Clients = {
    56: web3ClientBsc,
    97: web3ClientTestBsc,
    // 1: web3Client,
    // 137: polWeb3Client,
    // 8453: baseWeb3Client,
    // 42161: arbWeb3Client,
    // 43114: avaxWeb3Client,
}

export const imageUrl = isProduct !== 'local' ? 'http://localhost:8000/api/uploads/' : 'https://api.blackpump.net/api/uploads/'

export const apiUrl = isProduct !== 'local' ? 'http://localhost:8000' : 'https://api.blackpump.net'

export const ethPriceApiUrl = {
 1: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
 56: 'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD',
 97: 'https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD',
 8453: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
 137: 'https://min-api.cryptocompare.com/data/price?fsym=POL&tsyms=USD',
 42161: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
 43114: 'https://min-api.cryptocompare.com/data/price?fsym=AVAX&tsyms=USD',
}

export const supportedChainIds = [bsc.id, mainnet.id, base.id, polygon.id]

export const chainLogos = {
    1: 'img/chains/eth.svg',
    56: 'img/chains/bsc.svg',
    97: 'img/chains/testbsc.svg',
    137: 'img/chains/polygon.svg',
    8453: 'img/chains/base.svg',
    42161: 'img/chains/arbitrum.svg',
    43114: 'img/chains/avalanche.svg',
}

export const gasLimit = {
    1: 30_000_000n,
    56: 140_000_000n,
    // 137: 7.13,
    97: 0.005,
    137: 30_000_000n,
    8453: 30_000_000,
    42161: 30_000_000,
    43114: 30_000_000,
}


export const scanLinks = {
    8453: 'https://basescan.org/',
    1: 'https://etherscan.io/',
    56: 'https://bscscan.com/',
    97: 'https://testnet.bscscan.com/',
    137: 'https://polygonscan.com/',
    10: 'https://optimistic.etherscan.io/',
    42161: 'https://arbitrum.io/',
    43114: 'https://www.avax.network/'
}

export const scanApiLinks = {
    8453: 'https://api.basescan.org/api',
    1: 'https://api.etherscan.io/api',
    56: 'https://api.bscscan.com/api',
    97: 'https://api-testnet.bscscan.com/api',
    137: 'https://api.polygonscan.com/api'
}

export const shortenAddress = (address: string, length: number = 4): string => {
  if (typeof address !== 'string' || !address.startsWith('0x') || address.length < length * 2 + 2) {
    return 'Invalid address';
  }
  // Example: 0xABCD...1234 (if length=4)
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const formatBlockTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // convert seconds to ms
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month} ${day} - ${hours}:${minutes}`;
}

export const formatDatetime = (date: Date) => {
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month} ${day} - ${hours}:${minutes}`;
}

export const timeAgoFromSeconds = (inputSec: number) => {
  const nowSec = Math.floor(Date.now() / 1000)
  const diff = nowSec - inputSec

  if (diff < 60) {
    return `${diff} sec ago`
  } else if (diff < 3600) { // < 1 hour
    const mins = Math.floor(diff / 60)
    return `${mins} min ago`
  } else if (diff < 86400) { // < 1 day
    const hrs = Math.floor(diff / 3600)
    return `${hrs} hrs ago`
  } else if (diff < 2592000) { // < 30 days (~1 month)
    const days = Math.floor(diff / 86400)
    return `${days} days ago`
  } else {
    return 'over a month ago'
  }
}


export const apiKeys = {
    56: 'Y7TXAF2H8KCPY7AXFT7DSTBFUVH794ZCST',
    97: 'Y7TXAF2H8KCPY7AXFT7DSTBFUVH794ZCST',
}
export const usdtAddress = '0x55d398326f99059ff775485246999027b3197955'
export const defaultId = '166c810a1a76fedfcbfb4a4c442c40ed'
export const chainNames = {
    1: 'eth',
    8453: 'base',
    56: 'bnb',
    97: 'bnb',
    137: 'polygon',
    42161: 'arbitrum',
    43114: 'avalanche'
}

export default function formatNumber(number) {
    if (number >= 1000000) {
        return (number / 1000000).toLocaleString() + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toLocaleString() + 'K';
    } else {
        return number.toString();
    }
}

export const menuConfig = [
    {
        name: "Home",
        link: "/"
    },
    {
        name: "Play",
        link: "/prize"
    },
    {
        name: "Coin Flip",
        link: "/coinflip"
    },
    {
        name: "Dashboard",
        link: "/dashboard"
    },
    {
        name: "HowTo",
        link: "/howto"
    },
]

export const gamePlayers = [
    {
        address: '0x166c810a1a76fedfcbfb4a4c442c40ed',
        xp_used: 1000,
        game: 'Prize Pool',
        profit: 500,
    },
    {
        address: '0x166c810a1a76fedfcbfb4a4c442c40ed',
        xp_used: 1000,
        game: 'Prize Pool',
        profit: 500,
    },
    {
        address: '0x166c810a1a76fedfcbfb4a4c442c40ed',
        xp_used: 1000,
        game: 'Prize Pool',
        profit: 500,
    },
    {
        address: '0x166c810a1a76fedfcbfb4a4c442c40ed',
        xp_used: 1000,
        game: 'Prize Pool',
        profit: 500,
    },
    {
        address: '0x166c810a1a76fedfcbfb4a4c442c40ed',
        xp_used: 1000,
        game: 'Prize Pool',
        profit: 500,
    }
]