import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { readContract, waitForTransaction, writeContract } from '@wagmi/core';

import TopBar from '../components/TopBar.jsx';
import Footer from '../components/Footer.jsx';
import Countdown from '../components/Countdown.jsx';
import PendingModal from '../components/PendingModal.jsx';
import ResultModal from '../components/ResultModal.jsx';
import SocketLeaderboard from '../components/SocketLeaderboard.jsx';

import WavePrizePool from '../config/WavePrizePool.json';
import WaveToken from '../config/Wave.json';
const PrizePoolABI = Array.isArray(WavePrizePool) ? WavePrizePool : WavePrizePool.abi;
const TokenABI = Array.isArray(WaveToken) ? WaveToken : WaveToken.abi;

import { getWavePrizePoolAddress } from '../utils/addressHelpers.ts';
import { config } from '../config.jsx';
import { isAddress, maxUint256, zeroAddress } from 'viem';
import { shortenAddress, formatBlockTimestamp, timeAgoFromSeconds } from '../utils/constants.ts';
import { ethers } from 'ethers';

/* -------------------------- Toast helpers (pretty) ------------------------- */
const showError = (msg, icon = '🚫') =>
  toast.error(msg, {
    icon,
    style: {
      borderRadius: '12px',
      background: '#700707ff', // red-800
      color: '#fff',
      fontWeight: '600',
      padding: '12px 18px',
      fontSize: '15px',
    },
  });

const showSuccess = (msg, icon = '🏆') =>
  toast.success(msg, {
    icon,
    style: {
      borderRadius: '12px',
      background: '#093c1cff', // green-700
      color: '#fff',
      fontWeight: '600',
      padding: '12px 18px',
      fontSize: '15px',
    },
  });

const showInfo = (msg, icon = '🔔') =>
  toast(msg, {
    icon,
    style: {
      borderRadius: '12px',
      background: '#1f2b3eff', // slate-800
      color: '#fff',
      fontWeight: '600',
      padding: '12px 18px',
      fontSize: '15px',
    },
  });

/* --------------------------------- Utils ---------------------------------- */
const toBig = (v) => (typeof v === 'bigint' ? v : BigInt(v));
const nowSec = () => Math.floor(Date.now() / 1000);
const equalsAddr = (a, b) => (a ?? '').toLowerCase() === (b ?? '').toLowerCase();

/* ------------------------------- Component -------------------------------- */
function PrizePool() {
  const { address, chain } = useAccount();

  // Supported chains
  const SUPPORTED_CHAINS = useMemo(
    () =>
      new Map([
        [11155111, 'Sepolia'],
        [97, 'BSC Testnet'],
        // [56, 'BSC Mainnet'],
      ]),
    []
  );
  const chainId = chain?.id ?? 11155111; // default Sepolia
  const prizePoolAddress = getWavePrizePoolAddress(chainId);

  const isSupportedChain = SUPPORTED_CHAINS.has(chainId);
  const requireSupported = () => {
    if (!address || !isSupportedChain) {
      showError(`🔌 Connect wallet on ${[...SUPPORTED_CHAINS.values()].join(' or ')}`);
      return false;
    }
    return true;
  };

  const [pending, setPending] = useState(false);
  const [isFetchingPool, setFetchingPool] = useState(false);
  const [updated, setUpdated] = useState(0);
  const [open, setOpen] = useState(false);
  const [ismustclaim_d, setMustclaim_d] = useState(false);
  const [ismustclaim_m, setMustclaim_m] = useState(false);
  const [events, setEvents] = useState([]);
  const [avatars, setAvatars] = useState({});
  const avatarCache = useRef(new Map());
  const inflight = useRef(new Map());

  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      // tick for time-based renders (countdowns)
      tick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* ------------------------------- Daily Pool ------------------------------ */
  const [daily_userBalance, setDailyUserBalance] = useState(0n);
  const [daily_allowance, setDailyAllowance] = useState(0n);

  const [dailyPoolId, setdailyPoolId] = useState(null);
  const [dailyPool, setdailyPool] = useState(null);
  const [dailyPoolState, setdailyPoolState] = useState(null);

  const daily_baseToken = useMemo(() => (dailyPool ? dailyPool[0] : undefined), [dailyPool]);
  const daily_burnFee = useMemo(() => (dailyPool ? Number(dailyPool[1]) : 0), [dailyPool]);
  const daily_treasuryFee = useMemo(() => (dailyPool ? Number(dailyPool[2]) : 0), [dailyPool]);
  const daily_limitAmount = useMemo(() => (dailyPool ? toBig(dailyPool[3]) : 0n), [dailyPool]);
  const daily_ticketPrice = useMemo(() => (dailyPool ? toBig(dailyPool[4]) : 0n), [dailyPool]);
  const daily_startTime = useMemo(() => (dailyPool ? Number(dailyPool[5]) : 0), [dailyPool]);
  const daily_limitTime = useMemo(() => (dailyPool ? Number(dailyPool[6]) : 0), [dailyPool]);
  const daily_isActive = useMemo(() => (dailyPool ? Boolean(dailyPool[7]) : false), [dailyPool]);
  const dailypoolTokenBalance = useMemo(() => (dailyPoolState ? toBig(dailyPoolState[0]) : 0n), [dailyPoolState]);
  const dailypooljoinedPlayers = useMemo(
    () => (dailyPoolState ? Number(dailyPoolState[1].length) : 0),
    [dailyPoolState]
  );

  const daily_allowanceOk = useMemo(() => daily_allowance >= daily_ticketPrice, [daily_allowance, daily_ticketPrice]);
  const daily_userHasFunds = useMemo(
    () => daily_userBalance >= daily_ticketPrice,
    [daily_userBalance, daily_ticketPrice]
  );

  const daily_timeOpen = useMemo(() => {
    if (!daily_startTime) return true;
    if (!daily_limitTime) return true;
    return nowSec() < daily_startTime + daily_limitTime;
  }, [daily_startTime, daily_limitTime, tick]);

  /* ------------------------------- Mega Pool ------------------------------- */
  const [mega_userBalance, setMegaUserBalance] = useState(0n);
  const [mega_allowance, setMegaAllowance] = useState(0n);

  const [megaPoolId, setmegaPoolId] = useState(null);
  const [megaPool, setmegaPool] = useState(null);
  const [megaPoolState, setmegaPoolState] = useState(null);

  const mega_baseToken = useMemo(() => (megaPool ? megaPool[0] : undefined), [megaPool]);
  const mega_burnFee = useMemo(() => (megaPool ? Number(megaPool[1]) : 0), [megaPool]);
  const mega_treasuryFee = useMemo(() => (megaPool ? Number(megaPool[2]) : 0), [megaPool]);
  const mega_limitAmount = useMemo(() => (megaPool ? toBig(megaPool[3]) : 0n), [megaPool]);
  const mega_ticketPrice = useMemo(() => (megaPool ? toBig(megaPool[4]) : 0n), [megaPool]);
  const mega_startTime = useMemo(() => (megaPool ? Number(megaPool[5]) : 0), [megaPool]);
  const mega_limitTime = useMemo(() => (megaPool ? Number(megaPool[6]) : 0), [megaPool]);
  const mega_isActive = useMemo(() => (megaPool ? Boolean(megaPool[7]) : false), [megaPool]);
  const megapoolTokenBalance = useMemo(() => (megaPoolState ? toBig(megaPoolState[0]) : 0n), [megaPoolState]);
  const megapooljoinedPlayers = useMemo(
    () => (megaPoolState ? Number(megaPoolState[1].length) : 0),
    [megaPoolState]
  );

  const mega_allowanceOk = useMemo(() => mega_allowance >= mega_ticketPrice, [mega_allowance, mega_ticketPrice]);
  const mega_userHasFunds = useMemo(
    () => mega_userBalance >= mega_ticketPrice,
    [mega_userBalance, mega_ticketPrice]
  );

  const mega_timeOpen = useMemo(() => {
    if (!mega_startTime) return true;
    if (!mega_limitTime) return true;
    return nowSec() < mega_startTime + mega_limitTime;
  }, [mega_startTime, mega_limitTime, tick]);

  /* --------------------------- Formatting helper --------------------------- */
  const format18 = (val) => {
    try {
      const v = toBig(val);
      const whole = v / 1000000000000000000n;
      const frac = Number(v % 1000000000000000000n) / 1e18;
      return new Intl.NumberFormat().format(Number(whole) + frac);
    } catch {
      return '0';
    }
  };

  /* ------------------------------- API helper ------------------------------ */
  const API_BASE = (process.env.REACT_APP_API_BASE ?? '').replace(/\/$/, '');

  const normalizeUrl = (url) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url; // absolute
    if (url.startsWith('/avatars/')) return url; // frontend presets
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`; // backend relative
  };

  // Check if API_BASE is configured
  const isApiConfigured = API_BASE && API_BASE.length > 0;

  /* ------------------- Load pool list and select defaults ------------------ */
  useEffect(() => {
    (async () => {
      try {
        setFetchingPool(true);

        if (!prizePoolAddress || !isAddress(prizePoolAddress)) {
          showError('🚨 PrizePool address not configured for this network.', '❌');
          return;
        }

        const poolIds = await readContract(config, {
          address: prizePoolAddress,
          abi: PrizePoolABI,
          functionName: 'getAllPoolIds',
          args: [],
          chainId,
        });

        if (!poolIds || poolIds.length === 0) {
          showError('🚫 No pools have been created yet.', '💧');
          setdailyPoolId(null);
          setdailyPool(null);
          setdailyPoolState(null);
          setmegaPoolId(null);
          setmegaPool(null);
          setmegaPoolState(null);
          return;
        }

        // Pre-fetch configs
        const cfgs = await Promise.all(
          poolIds.map((pid) =>
            readContract(config, {
              address: prizePoolAddress,
              abi: PrizePoolABI,
              functionName: 'getPoolConfig',
              args: [pid],
              chainId,
            })
          )
        );

        let dailyClaimedPoolId = null;
        let dailyClaimedPoolCfg = null;
        let megaClaimedPoolId = null;
        let megaClaimedPoolCfg = null;
        let pair_claim = 0; // bitmask: 1=mega, 2=daily

        let foundId_daily = null;
        let foundCfg_daily = null;
        let foundId_mega = null;
        let foundCfg_mega = null;
        let pair = 0; // bitmask: 1=mega, 2=daily

        for (let i = 0; i < poolIds.length; i++) {
          const pid = poolIds[i];
          const cfg = cfgs[i];

          const isAlive =
            Number(cfg[5] || 0) === 0 || Number(cfg[6] || 0) === 0
              ? true
              : nowSec() < Number(cfg[5] || 0) + Number(cfg[6] || 0);

          // Prioritize "drawn && not claimed && winner is me"
          if (
            (pair_claim & 2) === 0 &&
            equalsAddr(cfg[11], address) &&
            Boolean(cfg[8]) === true &&
            Boolean(cfg[10]) === false &&
            Boolean(cfg[9]) === true
          ) {
            dailyClaimedPoolId = pid;
            dailyClaimedPoolCfg = cfg;
            pair_claim |= 2;
            continue;
          }
          if (
            (pair_claim & 1) === 0 &&
            equalsAddr(cfg[11], address) &&
            Boolean(cfg[8]) === true &&
            Boolean(cfg[10]) === false &&
            Boolean(cfg[9]) === false
          ) {
            megaClaimedPoolId = pid;
            megaClaimedPoolCfg = cfg;
            pair_claim |= 1;
            continue;
          }
          if (pair_claim === 3) break;

          // Then first active pools
          if ((pair & 2) === 0 && Boolean(cfg[7]) === true && Boolean(cfg[9]) === true && isAlive) {
            foundId_daily = pid;
            foundCfg_daily = cfg;
            pair |= 2;
            continue;
          }
          if ((pair & 1) === 0 && Boolean(cfg[7]) === true && Boolean(cfg[9]) === false && isAlive) {
            foundId_mega = pid;
            foundCfg_mega = cfg;
            pair |= 1;
            continue;
          }
          if (pair === 3) break;
        }

        const finalDailyId = dailyClaimedPoolId ?? foundId_daily;
        const finalDailyCfg = dailyClaimedPoolCfg ?? foundCfg_daily;
        const finalMegaId = megaClaimedPoolId ?? foundId_mega;
        const finalMegaCfg = megaClaimedPoolCfg ?? foundCfg_mega;

        setMustclaim_d(!!dailyClaimedPoolId);
        setdailyPoolId(finalDailyId ?? null);
        setdailyPool(finalDailyCfg ?? null);

        setMustclaim_m(!!megaClaimedPoolId);
        setmegaPoolId(finalMegaId ?? null);
        setmegaPool(finalMegaCfg ?? null);

        if (finalDailyId && finalDailyCfg) {
          const d_st = await readContract(config, {
            address: prizePoolAddress,
            abi: PrizePoolABI,
            functionName: 'getPoolState',
            args: [finalDailyId],
            chainId,
          });
          setdailyPoolState(d_st);
        } else {
          showInfo('📅 No Daily Pools Created!', '🚫');
        }

        if (finalMegaId && finalMegaCfg) {
          const m_st = await readContract(config, {
            address: prizePoolAddress,
            abi: PrizePoolABI,
            functionName: 'getPoolState',
            args: [finalMegaId],
            chainId,
          });
          setmegaPoolState(m_st);
        } else {
          showInfo('🎰 No Mega Pools Created!', '🚫');
        }
      } catch (err) {
        console.error(err);
        showError('⚠️ Init load failed.', '❌');
      } finally {
        setFetchingPool(false);
      }
    })();
  }, [chainId, prizePoolAddress, pending, address, updated]);

  /* ----------------------- Per-account allowance/balance ------------------- */
  useEffect(() => {
    (async () => {
      try {
        if (!address || !prizePoolAddress) return;

        if (isAddress(daily_baseToken)) {
          const [d_allow, d_ub] = await Promise.all([
            readContract(config, {
              address: daily_baseToken,
              abi: TokenABI,
              functionName: 'allowance',
              args: [address, prizePoolAddress],
              chainId,
            }),
            readContract(config, {
              address: daily_baseToken,
              abi: TokenABI,
              functionName: 'balanceOf',
              args: [address],
              chainId,
            }),
          ]);
          setDailyAllowance(toBig(d_allow));
          setDailyUserBalance(toBig(d_ub));
        }

        if (isAddress(mega_baseToken)) {
          const [m_allow, m_ub] = await Promise.all([
            readContract(config, {
              address: mega_baseToken,
              abi: TokenABI,
              functionName: 'allowance',
              args: [address, prizePoolAddress],
              chainId,
            }),
            readContract(config, {
              address: mega_baseToken,
              abi: TokenABI,
              functionName: 'balanceOf',
              args: [address],
              chainId,
            }),
          ]);
          setMegaAllowance(toBig(m_allow));
          setMegaUserBalance(toBig(m_ub));
        }
      } catch (err) {
        console.error('Account load failed:', err);
      }
    })();
  }, [address, chainId, prizePoolAddress, dailyPool, megaPool, pending, daily_baseToken, mega_baseToken]);

  /* -------------------------------- Actions -------------------------------- */
  const claimHandler = async (isDaily) => {
    if (!requireSupported()) return;
    if (pending) return showInfo('⏳ Transaction is pending...', '🔄');
    if (!isAddress(prizePoolAddress) || prizePoolAddress === zeroAddress) return showError('Invalid PrizePool Address', '❌');

    const unclaimedPoolId = isDaily ? dailyPoolId : megaPoolId;
    if (!unclaimedPoolId) return showError('No claimable pool selected.', '❌');

    try {
      setPending(true);
      const hash = await writeContract(config, {
        address: prizePoolAddress,
        abi: PrizePoolABI,
        functionName: 'claimPayout',
        args: [unclaimedPoolId],
        chainId,
      });
      await waitForTransaction(config, { hash });
      showSuccess('🎉 Claimed Successfully!');
    } catch (err) {
      console.error(err);
      showError('❌ Claim Failed.', '💥');
    } finally {
      setPending(false);
      if (isDaily) setMustclaim_d(false);
      else setMustclaim_m(false);
    }
  };

  const approveHandler_daily = async () => {
    if (!requireSupported()) return;
    if (pending) return showInfo('⏳ Transaction is pending...', '🔄');
    if (!dailyPool) return showError('Pool not loaded', '❌');

    const token = dailyPool[0];
    if (!isAddress(token)) return showError('Invalid token address', '❌');

    try {
      setPending(true);
      const hash = await writeContract(config, {
        address: token,
        abi: TokenABI,
        functionName: 'approve',
        args: [prizePoolAddress, maxUint256],
        chainId,
      });
      await waitForTransaction(config, { hash });
      showSuccess('✅ Approve Confirmed!', '🎯');
    } catch (err) {
      console.error(err);
      showError('❌ Approve Failed!', '💥');
    } finally {
      setPending(false);
    }
  };

  const approveHandler_mega = async () => {
    if (!requireSupported()) return;
    if (pending) return showInfo('⏳ Transaction is pending...', '🔄');
    if (!megaPool) return showError('Pool not loaded', '❌');

    const token = megaPool[0];
    if (!isAddress(token)) return showError('Invalid token address', '❌');

    try {
      setPending(true);
      const hash = await writeContract(config, {
        address: token,
        abi: TokenABI,
        functionName: 'approve',
        args: [prizePoolAddress, maxUint256],
        chainId,
      });
      await waitForTransaction(config, { hash });
      showSuccess('✅ Approve Confirmed!', '🎯');
    } catch (err) {
      console.error(err);
      showError('❌ Approve Failed!', '💥');
    } finally {
      setPending(false);
    }
  };

  const precheck_d = (price) => {
    if (!dailyPoolId) return showError('📅 No daily pool selected.'), false;
    if (!daily_isActive) return showError('🛑 Daily Pool is not active.'), false;
    if (!daily_timeOpen) return showError('⏰ Daily Pool is closed (time).'), false;
    if (daily_userBalance < price) return showError('💸 Not enough daily tokens.'), false;
    if (daily_allowance < price) return showError('🔐 Please approve daily pool first.'), false;
    return true;
  };

  const precheck_m = (price) => {
    if (!megaPoolId) return showError('🎰 No mega pool selected.'), false;
    if (!mega_isActive) return showError('🛑 Mega Pool is not active.'), false;
    if (!mega_timeOpen) return showError('⏰ Mega Pool is closed (time).'), false;
    if (mega_userBalance < price) return showError('💸 Not enough mega tokens.'), false;
    if (mega_allowance < price) return showError('🔐 Please approve mega pool first.'), false;
    return true;
  };

  const enterPool = async ({ pool, poolId, price, precheck, setPoolState, successMsg = '🎉 Joined Pool Successfully.' }) => {
    if (!requireSupported()) return false;
    if (pending) {
      showInfo('⏳ Transaction is pending...', '🔄');
      return false;
    }
    if (!pool || !poolId) {
      showError('Pool not loaded', '❌');
      return false;
    }
    if (!precheck?.(price)) return false;

    try {
      setPending(true);
      const hash = await writeContract(config, {
        address: prizePoolAddress,
        abi: PrizePoolABI,
        functionName: 'enterPool',
        args: [poolId, price],
        chainId,
      });

      await waitForTransaction(config, { hash });
      showSuccess(successMsg);

      const st = await readContract(config, {
        address: prizePoolAddress,
        abi: PrizePoolABI,
        functionName: 'getPoolState',
        args: [poolId],
        chainId,
      });
      setPoolState(st);
      return true;
    } catch (err) {
      console.error(err);
      showError('❌ Join Failed.', '💥');
      return false;
    } finally {
      setPending(false);
    }
  };

  /* ------------------------------- Avatars --------------------------------- */
  const fetchAvatar = useCallback(
    async (addr) => {
      if (!addr) return null;
      
      // If API is not configured, return null immediately
      if (!isApiConfigured) {
        return null;
      }
      
      const a = addr.toLowerCase();

      if (avatarCache.current.has(a)) return avatarCache.current.get(a);
      if (inflight.current.has(a)) return inflight.current.get(a);

      const p = (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/avatar/${a}`, { mode: 'cors' });
          if (res.status === 404) return null;
          if (!res.ok) throw new Error((await res.text().catch(() => 'avatar load failed')));

          const data = await res.json().catch(() => ({}));
          const url = data.avatarUrl || data.avatar || data.url || null;

          avatarCache.current.set(a, url);
          setAvatars((prev) => (a in prev ? prev : { ...prev, [a]: url }));
          return url;
        } catch (e) {
          console.warn(`Failed to load avatar for ${a}:`, e.message);
          return null;
        } finally {
          inflight.current.delete(a);
        }
      })();

      inflight.current.set(a, p);
      return p;
    },
    [API_BASE, isApiConfigured]
  );

  useEffect(() => {
    const list = dailyPoolState?.[1] ?? [];
    const unique = [...new Set(list.map((x) => x?.user).filter(Boolean))];
    unique.forEach((addr) => {
      void fetchAvatar(addr);
    });
  }, [dailyPoolState, fetchAvatar]);

  useEffect(() => {
    const list = megaPoolState?.[1] ?? [];
    const unique = [...new Set(list.map((x) => x?.user).filter(Boolean))];
    unique.forEach((addr) => {
      void fetchAvatar(addr);
    });
  }, [megaPoolState, fetchAvatar]);

  /* ---------------------------- Buy/Join handlers -------------------------- */
  const buyDailyTicketsHandler = () =>
    enterPool({
      pool: dailyPool,
      poolId: dailyPoolId,
      price: daily_ticketPrice,
      precheck: precheck_d,
      setPoolState: setdailyPoolState,
      successMsg: '🎉 Joined Daily Pool Successfully.',
    });

  const buyMegaTicketsHandler = () =>
    enterPool({
      pool: megaPool,
      poolId: megaPoolId,
      price: mega_ticketPrice,
      precheck: precheck_m,
      setPoolState: setmegaPoolState,
      successMsg: '🎉 Joined Mega Pool Successfully.',
    });

  /* ------------------------ Realtime WS event listener --------------------- */
  useEffect(() => {
    const RAW = process.env.REACT_APP_SEPALC_WSS_URL ?? '';
    const WSS_URL = RAW.trim().replace(/^"|"$/g, '');
    if (!WSS_URL) return;
    if (!isAddress(prizePoolAddress)) return;

    const provider = new ethers.providers.WebSocketProvider(WSS_URL);
    const contract = new ethers.Contract(prizePoolAddress, PrizePoolABI, provider);

    const handler = (poolId, winner, reward, pooltype, event) => {
      const txHash = event?.transactionHash || null;

      setEvents((prev) => [
        {
          poolId,
          winner,
          reward: reward.toString(),
          pooltype,
          txHash,
        },
        ...prev,
      ]);

      const winAddr = String(winner).toLowerCase();
      const me = String(address ?? '').toLowerCase();

      showSuccess(`🎉 Winner: ${shortenAddress(winner, 4)}!`);
      setUpdated((p) => p + 1);
      setOpen((p) => (winAddr === me ? 2 : 1));
    };

    const poolUpdateHandler = () => setUpdated((p) => p + 1);

    contract.on('WinnerDrawn', handler);
    contract.on('EnteredPool', poolUpdateHandler);
    contract.on('PoolEnded', poolUpdateHandler);

    return () => {
      try {
        contract.off('WinnerDrawn', handler);
        contract.off('EnteredPool', poolUpdateHandler);
        contract.off('PoolEnded', poolUpdateHandler);
        provider.destroy?.();
      } catch {
        /* no-op */
      }
    };
  }, [prizePoolAddress, address]);

  /* --------------------------------- UI ctl -------------------------------- */
  const isshowdailyPoolJoinActive = (daily_isActive && daily_timeOpen) || ismustclaim_d;
  const isdailyPoolApprove = daily_allowanceOk && daily_userHasFunds;
  const dailyAction = ismustclaim_d ? () => claimHandler(true) : isdailyPoolApprove ? buyDailyTicketsHandler : approveHandler_daily;
  const dailyLabel = ismustclaim_d ? 'Claim' : isdailyPoolApprove ? 'Join Pool' : 'Approve';

  const isshowmegaPoolJoinActive = (mega_isActive && mega_timeOpen) || ismustclaim_m;
  const ismegaPoolApprove = mega_allowanceOk && mega_userHasFunds;
  const megaAction = ismustclaim_m ? () => claimHandler(false) : ismegaPoolApprove ? buyMegaTicketsHandler : approveHandler_mega;
  const megaLabel = ismustclaim_m ? 'Claim' : ismegaPoolApprove ? 'Join Pool' : 'Approve';
 

  return (
    <>
      <TopBar />

      {/* HERO */}
      <div className="hero-area pool">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 d-flex align-self-center">
              <div className="left-content">
                <div className="content">
                  <h1 className="title">Prize Pool</h1>
                  <p className="text">
                    Step into the Wave Wealth arena and unlock the chance to win big!
                    Our prize pool is transparent, community-driven, and constantly growing, all powered by your participation and excitement.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img2 d-block d-md-none">
                <img src="assets/images/pools/prize-pool.png" alt="" />
              </div>
              <div className="hero-img d-none d-md-block">
                <img className="shape man" src="assets/images/pools/prize-pool.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="featured-game-before pool-gradient"></div>

      {/* STATS */}
      <section className="lottery-area">
        <div className="lottery-staticstics">
          <div className="container">
            <div className="row">
              {/* Prize Pool Amount (pool's token balance)  */}
              <div className="col-lg-4">
                <div className="single-staticstics balance-amount-card">
                  <span className="balance-title">Balance Amount</span>
                  <div className="balance-sections">
                    <div className="balance-section mega-section">
                      <div className="balance-label">Mega:</div>
                      <div className="balance-content">
                        <img src="/logo.png" alt="Wave Logo" className="balance-logo" />
                        <span className="balance-value">{format18(megapoolTokenBalance)}</span>
                      </div>
                    </div>
                    <div className="balance-divider"></div>
                    <div className="balance-section daily-section">
                      <div className="balance-label">Daily:</div>
                      <div className="balance-content">
                        <img src="/logo.png" alt="Wave Logo" className="balance-logo" />
                        <span className="balance-value">{format18(dailypoolTokenBalance)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Prize Pool Amount (pool’s token balance)*/}

              {/* Prize Pool Limit Amount */}
              <div className="col-lg-4">
                <div className="single-staticstics balance-amount-card">
                  <h4 className="balance-title">Limit Amount</h4>
                  <div className="balance-sections">
                    <div className="balance-section mega-section">
                      <div className="balance-label">Mega:</div>
                      <div className="balance-content">
                        <img src="/logo.png" alt="Wave Logo" className="balance-logo" />
                        <span className="balance-value">{format18(mega_limitAmount)}</span>
                      </div>
                    </div>
                    <div className="balance-divider"></div>
                    <div className="balance-section daily-section">
                      <div className="balance-label">Daily:</div>
                      <div className="balance-content">
                        <img src="/logo.png" alt="Wave Logo" className="balance-logo" />
                        <span className="balance-value">{format18(daily_limitAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*  Prize Pool Limit Amount */}

              {/* Prize Pool Reward Rate */}
              <div className="col-lg-4">
                <div className="single-staticstics balance-amount-card">
                  <h4 className="balance-title">Reward Rate</h4>
                  <div className="balance-sections">
                    <div className="balance-section mega-section">
                      <div className="balance-label">Mega:</div>
                      <div className="balance-content">
                        <img src="/logo.png" alt="Wave Logo" className="balance-logo" />
                        <span className="balance-value">{megaPool ? (100 - mega_burnFee - mega_treasuryFee) + '%' : '0%'}</span>
                      </div>
                    </div>
                    <div className="balance-divider"></div>
                    <div className="balance-section daily-section">
                      <div className="balance-label">Daily:</div>
                      <div className="balance-content">
                        <img src="/logo.png" alt="Wave Logo" className="balance-logo" />
                        <span className="balance-value">{dailyPool ? (100 - daily_burnFee - daily_treasuryFee) + '%' : '0%'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Prize Pool Reward Rate */}
            </div>
          </div>
        </div>

        {/* Prize Pools Header */}
        <div className="prize-pools-header">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h2 className="prize-pools-title">Prize Pools</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="daily-lottery">
          <div className="container">
            <div className='row'>
              <div className="col-lg-12">
                <div className='game-rules-new'>
                  <div className="game-rules-title">Game Rules</div>
                  <div className="game-rules-divider"></div>
                  <div className="game-rules-content">
                    <ul>
                      <li>Auto Winner Selected</li>
                      <li>Everybody has a chance to win. The winner is selected randomly from all tickets purchased by players.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POOLS */}
      <section className='prize-pools'>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">

              {/* MEGA POOL */}
              <div className="mega-pool-card">
                <div className="mega-pool-icon">
                  <img src="assets/images/pools/pool2.gif" alt="Mega Wave"/>
                </div>
                <div className="mega-pool-content">
                  <div className="mega-pool-header">
                    <h4 className="mega-pool-title">Mega Wave</h4>
                    <div className="mega-pool-prize">
                      <span>${format18(mega_limitAmount)}</span>
                    </div>
                  </div>
                  <p className="mega-pool-subtitle">Big Monthly Prize</p>
                </div>
                <div className="mega-pool-stats">
                  <div className="mega-stat-item">
                    <span className="mega-stat-label">Required XP:</span>
                    <div className="mega-stat-value">
                      <img src="/logo.png" alt="Wave" width={20} />
                      <span>{megaPool ? format18(mega_ticketPrice) : '0'}</span>
                    </div>
                  </div>
                  <div className="mega-stat-item">
                    <span className="mega-stat-label">Players Joined:</span>
                    <div className="mega-stat-value">
                      <img src="/assets/images/awards/ref.gif" alt="Players" width={20} className="rounded-circle"/>
                      <span>{megapooljoinedPlayers}</span>
                    </div>
                  </div>
                </div>
                <div className="mega-pool-timer">
                  <div className="timer-labels">
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                  </div>
                  <div className="timer-values">
                    <div className="timer-value">
                      {(() => {
                        if (!mega_startTime || !mega_limitTime) return '00';
                        const now = Math.floor(Date.now() / 1000);
                        const timeLeft = (mega_startTime + mega_limitTime) - now;
                        if (timeLeft <= 0) return '00';
                        const hours = Math.floor(timeLeft / 3600);
                        return hours.toString().padStart(2, '0');
                      })()}
                    </div>
                    <div className="timer-value">
                      {(() => {
                        if (!mega_startTime || !mega_limitTime) return '00';
                        const now = Math.floor(Date.now() / 1000);
                        const timeLeft = (mega_startTime + mega_limitTime) - now;
                        if (timeLeft <= 0) return '00';
                        const minutes = Math.floor((timeLeft % 3600) / 60);
                        return minutes.toString().padStart(2, '0');
                      })()}
                    </div>
                    <div className="timer-value">
                      {(() => {
                        if (!mega_startTime || !mega_limitTime) return '00';
                        const now = Math.floor(Date.now() / 1000);
                        const timeLeft = (mega_startTime + mega_limitTime) - now;
                        if (timeLeft <= 0) return '00';
                        const seconds = timeLeft % 60;
                        return seconds.toString().padStart(2, '0');
                      })()}
                    </div>
                  </div>
                </div>
                <div className="mega-pool-actions">
                  <button
                    type="button"
                    className="join-pool-btn"
                    onClick={megaAction}
                  >
                    {megaLabel} →
                  </button>
                </div>
              </div>

              {/* MEGA WAVE - LEADERBOARD AND JOIN FEED */}
              <div className="row mb-4">
                <div className="col-lg-6">
                  <div className="mega-leaderboard-card">
                    <div className="card-header">
                      <img src="/assets/images/leaderboard.svg" alt="Leaderboard" width={32} height={32} />
                      <h5>Leaderboard</h5>
                    </div>
                    <div className="card-content">
                      <SocketLeaderboard apiUrl="/api/leaderboard" body={{ gameType: 'pool', page: 1, limit: 10, poolType: false }}/>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mega-join-feed-card">
                    <div className="card-header">
                      <img src="/assets/images/leaderboard.svg" alt="Join Feed" width={32} height={32} />
                      <h5>Join Feed</h5>
                    </div>
                    <div className="card-content">
                      {megaPoolState && megaPoolState[1].slice(0, 5).map((item, index) => (
                        <div className="leaderboard-row" key={index}>
                          <div className="leaderboard-avatar-column">
                            <img src={normalizeUrl(avatars[item.user.toLowerCase()]) || '/avatars/1.png'} alt="Avatar" className="leaderboard-avatar" />
                          </div>
                          <div className="name-column">
                            <span className="name-placeholder">{shortenAddress(item.user, 4)}</span>
                          </div>
                          <div className="points-column">
                            <span className="text-warning fw-semibold">{timeAgoFromSeconds(Number(item.betTime))}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* DAILY WAVE */}
              <div className="col-lg-12">
                <div className="mega-pool-card">
                  <div className="mega-pool-icon">
                    <img src="assets/images/pools/pool1.gif" alt="Daily Wave"/>
                  </div>
                  <div className="mega-pool-content">
                    <div className="mega-pool-header">
                      <h4 className="mega-pool-title">Daily Wave</h4>
                      <div className="mega-pool-prize">
                        <span>${dailyPool ? format18(daily_limitAmount) : '0'}</span>
                      </div>
                    </div>
                    <p className="mega-pool-subtitle">Daily Prize</p>
                  </div>
                  <div className="mega-pool-stats">
                    <div className="mega-stat-item">
                      <span className="mega-stat-label">Required XP:</span>
                      <div className="mega-stat-value">
                        <img src="/logo.png" alt="Wave" width={20} />
                        <span>{dailyPool ? format18(daily_ticketPrice) : '0'}</span>
                      </div>
                    </div>
                    <div className="mega-stat-item">
                      <span className="mega-stat-label">Players Joined:</span>
                      <div className="mega-stat-value">
                        <img src="/assets/images/awards/ref.gif" alt="Players" width={20} className="rounded-circle"/>
                        <span>{dailypooljoinedPlayers}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mega-pool-timer">
                    <div className="timer-labels">
                      <span>Hours</span>
                      <span>Minutes</span>
                      <span>Seconds</span>
                    </div>
                    <div className="timer-values">
                      <div className="timer-value">
                        {(() => {
                          if (!daily_startTime || !daily_limitTime) return '00';
                          const now = Math.floor(Date.now() / 1000);
                          const timeLeft = (daily_startTime + daily_limitTime) - now;
                          if (timeLeft <= 0) return '00';
                          const hours = Math.floor(timeLeft / 3600);
                          return hours.toString().padStart(2, '0');
                        })()}
                      </div>
                      <div className="timer-value">
                        {(() => {
                          if (!daily_startTime || !daily_limitTime) return '00';
                          const now = Math.floor(Date.now() / 1000);
                          const timeLeft = (daily_startTime + daily_limitTime) - now;
                          if (timeLeft <= 0) return '00';
                          const minutes = Math.floor((timeLeft % 3600) / 60);
                          return minutes.toString().padStart(2, '0');
                        })()}
                      </div>
                      <div className="timer-value">
                        {(() => {
                          if (!daily_startTime || !daily_limitTime) return '00';
                          const now = Math.floor(Date.now() / 1000);
                          const timeLeft = (daily_startTime + daily_limitTime) - now;
                          if (timeLeft <= 0) return '00';
                          const seconds = timeLeft % 60;
                          return seconds.toString().padStart(2, '0');
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="mega-pool-actions">
                    <button
                      type="button"
                      className="join-pool-btn"
                      onClick={dailyAction}
                    >
                      {dailyLabel} →
                    </button>
                  </div>
                </div>
              </div>
              
              {/* DAILY WAVE - LEADERBOARD AND JOIN FEED */}
              <div className="row mb-4">
                <div className="col-lg-6">
                  <div className="mega-leaderboard-card">
                    <div className="card-header">
                      <img src="/assets/images/leaderboard.svg" alt="Leaderboard" width={32} height={32} />
                      <h5>Leaderboard</h5>
                    </div>
                    <div className="card-content">
                      <SocketLeaderboard apiUrl="/api/leaderboard" body={{ gameType: 'pool', page: 1, limit: 10, poolType: true }}/>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mega-join-feed-card">
                    <div className="card-header">
                      <img src="/assets/images/leaderboard.svg" alt="Join Feed" width={32} height={32} />
                      <h5>Join Feed</h5>
                    </div>
                    <div className="card-content">
                      {dailyPoolState && dailyPoolState[1].slice(0, 5).map((item, index) => (
                        <div className="leaderboard-row" key={index}>
                          <div className="leaderboard-avatar-column">
                            <img src={normalizeUrl(avatars[item.user.toLowerCase()]) || '/avatars/1.png'} alt="Avatar" className="leaderboard-avatar" />
                          </div>
                          <div className="name-column">
                            <span className="name-placeholder">{shortenAddress(item.user, 4)}</span>
                          </div>
                          <div className="points-column">
                            <span className="text-warning fw-semibold">{timeAgoFromSeconds(Number(item.betTime))}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="activities">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-heading">
                <h2 className="title">
                  Latest Activities
                </h2>
                <p className="text">
                  The world's first truly fair and global prize pool. Every player has a fair shot at today's prize.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="tab-menu-area">
                <ul className="nav nav-lend mb-3" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="purchased-tickets-tab" data-bs-toggle="tab"
                      data-bs-target="#purchased-tickets" type="button" role="tab"
                      aria-controls="purchased-tickets" aria-selected="true">purchased tickets</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="my-tickets-tab" data-bs-toggle="tab"
                      data-bs-target="#my-tickets" type="button" role="tab" aria-controls="my-tickets"
                      aria-selected="false">my tickets</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="history-tab" data-bs-toggle="tab" data-bs-target="#my-history"
                      type="button" role="tab" aria-controls="my-history"
                      aria-selected="false">history</button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" >
                <div className="tab-pane fade show active" id="purchased-tickets" role="tabpanel"
                  aria-labelledby="purchased-tickets-tab">
                  <div className="responsive-table ">
                    <table className="table text-center" >
                      <thead>
                        <tr>
                          <th scope="col">Wallet Address</th>
                          <th scope="col">XP Used</th>
                          <th scope="col">Entry Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyPoolState && dailyPoolState[1].map((item, index) => (
                          <tr key={index}>
                            <td>
                              {shortenAddress(item.user, 4)}
                            </td>
                            <td>
                              <img src="/logo.png" alt="" width={20} style={{ marginRight: '2px', marginBottom: '4px' }} />
                              {" " + format18(item.xpAmount)}
                            </td>
                            <td>
                              {formatBlockTimestamp(Number(item.betTime))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="tab-pane fade" id="my-tickets" role="tabpanel" aria-labelledby="my-tickets-tab">
                  <div className="responsive-table">
                    <table className="table text-center">
                      <thead>
                        <tr>
                          <th scope="col">Wallet Address</th>
                          <th scope="col">Ticket Price</th>
                          <th scope="col">Ticket Numbers</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{address ? shortenAddress(address, 4) : '-'}</td>
                          <td>
                            <img src="/logo.png" alt="" width={20} style={{ marginRight: 2, marginBottom: 4 }} />
                            {" " + format18(dailyPoolState?.[1]?.[0]?.xpAmount ?? 0n)}
                          </td>
                          <td>
                            {(dailyPoolState?.[1] ?? [])
                              .filter(i => i?.user?.toLowerCase() === address?.toLowerCase())
                              .length}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="tab-pane fade" id="my-history" role="tabpanel" aria-labelledby="history-tab">
                  <div className="responsive-table">
                    <table className="table text-center">
                      <thead>
                        <tr>
                          <th scope="col">Pool Type</th>
                          <th scope="col">Winner</th>
                          <th scope="col">Reward</th>
                          <th scope="col">Date / Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events && events.map((e, i) => (
                          <tr key={i}>
                            <td>
                              {e.poolType?"Daily Pool":"Mega Pool"}
                            </td>
                            <td>
                              {shortenAddress(e.winner, 4)}
                            </td>
                            <td>
                              <img src="/logo.png" alt="" width={20} style={{ marginRight: '2px', marginBottom: '4px' }} />
                              {format18(e.reward)}
                            </td>
                            <td>
                              {formatBlockTimestamp(nowSec())}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PendingModal  show={ pending || isFetchingPool}  imageSrc="/assets/images/turninglogo(0).gif" />
      <ResultModal
        open={open}
        onClose={() => setOpen(0)}
        imageSrc={open == 2? "/assets/images/winner.png":"/assets/images/lose.png"}
        alt="You win!"
      />
      
        {/* Bottom Animation */}
        <div className="bottom-animation-container">
          <div className="bottom-animation-gradient"></div>
        </div>
      
      <Footer />
    </>
  )
}

export default PrizePool
