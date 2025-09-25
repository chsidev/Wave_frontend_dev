import addresses from './contracts.ts'

export const getAddress = (
  address?: { [chainId: number]: string },
  chainId?: number
): string => {
  // If address is provided and chainId matches, return the specific address
  if (address && chainId) {
    return address[chainId]
  }

  // If address is provided but chainId is not, return the default address
  if (address) {
    return address[56]
  }

  // If address is not provided, return an empty string
  return ''
}
export const getWethAddress = (chainId?: number) => {
  return getAddress(addresses?.WETHAddress, chainId)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses?.multicallAddress, chainId)
}
export const getLotteryAddress = (chainId?: number) => {
  return getAddress(addresses?.lotteryAddress, chainId)
}
export const getWavePrizePoolAddress = (chainId?: number) => {
  return getAddress(addresses?.WavePrizePoolAddress, chainId)
}
export const getWaveFlipAddress = (chainId?: number) => {
  return getAddress(addresses?.waveFlipAddress, chainId)
}
export const getWaveAddress = (chainId?: number) => {
  return getAddress(addresses?.waveAddress, chainId)
}
export const getFactoryAddress = (chainId?: number) => {
  return getAddress(addresses?.factoryAddress, chainId)
}
export const getRouterAddress = (chainId?: number) => {
  return getAddress(addresses?.routerAddress, chainId)
}
export const getDefaultAddress = () => {
  return getAddress(addresses?.defaultAddress)
}
export const getWaveFlipChallengeAddress = (chainId?: number) => {
  return getAddress(addresses?.WaveCoinFlipContractAddress, chainId)
}
export const getXPTokenAddress = (chainId?: number) => {
  return getAddress(addresses?.XPTokenAddress, chainId)
}
