import { createWeb3Modal } from '@web3modal/wagmi'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { bsc, bscTestnet } from 'viem/chains'
import dotenv from 'dotenv'
import { defaultId } from './utils/constants.ts'

dotenv.config()

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || defaultId

// Debug logging
console.log('WalletConnect Project ID:', projectId)
console.log('Environment Project ID:', process.env.NEXT_PUBLIC_PROJECT_ID)

// 2. Create wagmiConfig
const metadata = {
  name: 'Wave Wealth',
  description: 'Play, Invest, Exchange and Join the Contest with high rewards at Wave Wealth!',
  url: 'https://wavewealth.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [bscTestnet, bsc] // BNB Testnet as default, BNB Mainnet as secondary
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: true,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

export { config }