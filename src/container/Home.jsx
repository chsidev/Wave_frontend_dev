import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'
import TopBar from '../components/TopBar'
import Featured from '../components/Featured'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Pools from '../components/Pools'
import WaveLottery from '../config/WavePrizePool.json'
import { config } from '../config.jsx'
import { getWavePrizePoolAddress } from '../utils/addressHelpers.ts'

function Home() {
  // Import the ABI for the Wave Lottery Prize Pool
  const WaveLotteryAbi = Array.isArray(WaveLottery) ? WaveLottery : WaveLottery.abi;
  const { chain } = useAccount()
  const standardChain = 97

  const [DailyPoolId, setDailyPoolId] = useState(null)
  const [DailyPoolData, setDailyPoolData] = useState(null) // tuple from getPoolConfig
  const [DailyLimitTime, setDailyLimitTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchInitData() {
      setLoading(true)
      setErrorMsg('')
      setDailyPoolId(null)
      setDailyPoolData(null)
      setDailyLimitTime(0)

      try {
        const chainId = chain?.id ?? standardChain
        const prizePoolAddress = getWavePrizePoolAddress(chainId)

        const nowSec = () => Math.floor(Date.now() / 1000)

        // 1) Get all pool ids (bytes32[])
        const poolIds = await readContract(config, {
          address: prizePoolAddress,
          abi: WaveLotteryAbi,
          functionName: 'getAllPoolIds',
          args: [],
          chainId,
        })

        if (cancelled) return

        if (!poolIds || poolIds.length === 0) {
          setErrorMsg('No pools have been created yet.')
          return
        }

        // 2) Find the FIRST active pool (earliest)
        let chosenId = null
        let chosenConfig = null
        let isMegaSelected = false

        for (let i = 0; i < poolIds.length; i++) {
          const pid = poolIds[i]
          const cfg = await readContract(config, {
            address: prizePoolAddress,
            abi: WaveLotteryAbi,
            functionName: 'getPoolConfig',
            args: [pid],
            chainId,
          })
          // getPoolConfig returns a tuple:
          // [0]=baseToken, [1]=burnFee, [2]=treasuryFee, [3]=limitAmount,
          // [4]=ticketPrice, [5]=startTime, [6]=limitDuration, [7]=isActive, [8]=drawRequested, [9]=drawn, [10]=poolType
          const isActive = Boolean(cfg[7])
          const isDaily = Boolean(cfg[10])
          if (isActive && isDaily && nowSec() <= (cfg[5] + cfg[6])) {
            chosenId = pid
            chosenConfig = cfg
            break // first/earliest active
          }
          if (isMegaSelected === false && isActive && !isDaily && nowSec() <= (cfg[5] + cfg[6])) {
            chosenId = pid
            chosenConfig = cfg
            isMegaSelected = true // we found a mega pool, no need to look further
          }
        }

        if (cancelled) return

        if (!chosenId) {
          setErrorMsg('No Active Daily Pools At The Moment...')
          return
        }

        // 3) Compute limit time = startTime + limitDuration
        const startTime = Number(chosenConfig[5])
        const limitDuration = Number(chosenConfig[6])
        const futureTimestamp = startTime + limitDuration // seconds (if duration != 0)

        if (futureTimestamp <= nowSec) {
          setErrorMsg('The selected pool has already ended.')
          return
        }
        // 4) Set state with the chosen pool data
        setDailyPoolId(chosenId)
        setDailyPoolData(chosenConfig)
        setDailyLimitTime(futureTimestamp)
      } catch (err) {
        console.error('Home::fetchInitData error', err)
        setErrorMsg('Failed to load pool data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchInitData()
    return () => {
      cancelled = true
    }
  }, [chain])

  return (
    <div className="home-page">
      <TopBar />
      <Hero />
      <div className="featured-game-before"></div>
      <Featured />

      {loading && (
        <div style={{ textAlign: 'center', padding: '12px' }}>
          <img src="/assets/images/loading.gif"/>
        </div>
      )}

      {!loading && errorMsg && (
        <div style={{ textAlign: 'center', color: 'crimson', padding: '12px' }}>
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && DailyPoolData && (
        <Pools LimitTime={DailyLimitTime} PoolData={DailyPoolData} PoolId={DailyPoolId} />
      )}

      {/* Bottom Animation */}
      <div className="bottom-animation-container">
        <div className="bottom-animation-gradient"></div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
