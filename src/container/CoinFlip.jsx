import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { readContract, waitForTransaction, writeContract } from '@wagmi/core';
import TopBar from '../components/TopBar.jsx';

import WaveFlip from '../config/WaveChallengeFlip.json';
import WaveAbi from '../config/XPToken.json';

import Footer from '../components/Footer.jsx';
import {
  getXPTokenAddress,
  getWaveFlipChallengeAddress
} from '../utils/addressHelpers.ts';
import { config } from '../config.jsx';
import { shortenAddress } from '../utils/constants.ts';
import { formatBlockTimestamp } from '../utils/constants.ts';
import { formatDatetime } from '../utils/constants.ts';
import { ethers } from 'ethers';
import PendingModal from '../components/PendingModal.jsx';
import SocketLeaderboard from '../components/SocketLeaderboard.jsx';
import ResultModal from "../components/ResultModal.jsx";

// Backend base URL (no Vite assumptions)
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.REACT_APP_API_BASE
).replace(/\/$/, '');

// Only prefix backend-relative URLs; leave frontend assets (e.g. /avatars/5.png) as-is.
const normalizeUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;        // absolute
  if (url.startsWith('/avatars/')) return url;      // frontend presets
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`; // backend relative
};

/* ============================= Toast helpers ============================== */
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

/* ================================= Utils ================================= */
const toBig = (v) => (typeof v === 'bigint' ? v : BigInt(v));

function CoinFlip() {
  // ABI
  const WaveFlipAbi = Array.isArray(WaveFlip) ? WaveFlip : WaveFlip.abi;

  const { address, chain } = useAccount();
  const standardChain = 97; // BSC Testnet (change if you want another default)

  // --- State ---
  const [gameIds, setGameIds] = useState([]);
  const [gameMinTokenAmount, setGameMinTokenAmount] = useState([]);
  const [newGameId, setNewGameId] = useState(null);
  const [historyChallenge, setHistoryChallenge] = useState([]);
  const [pending, setPending] = useState(false);
  const [isFetchingChallenge, setFetchingChallenge] = useState(false);
  const [open, setOpen] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [isHead, setIsHead] = useState(true);
  const [wager, setWager] = useState(0);
  const [events, setEvents] = useState([]);
  
  // Avatar state
  const [currentAvatar, setCurrentAvatar] = useState('/avatars/1.png');
  const [coinflipHistory, setCoinflipHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE = (process.env.REACT_APP_API_BASE ?? '').replace(/\/$/, '');

  // ------------------------------ Load avatar -----------------------------
  useEffect(() => {
    if (!address) {
      setCurrentAvatar('/avatars/1.png');
      return;
    }
    
    const loadAvatar = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/avatar/${address.toLowerCase()}`, {
          mode: 'cors',
        });
        if (!res.ok) {
          if (res.status === 404) return; // not set yet
          throw new Error(`Failed to load avatar (${res.status})`);
        }
        const data = await res.json();
        const url = data?.avatarUrl || data?.avatar || data?.url;
        if (url) setCurrentAvatar(normalizeUrl(url));
      } catch (e) {
        console.warn('Failed to load avatar:', e.message);
      }
    };
    
    loadAvatar();
  }, [address]);

  // ------------------------------ Fetch history -----------------------------
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bets/gamehistory?page=${page}&limit=${limit}`);
        const data = await res.json();
        setCoinflipHistory(data.history || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Connection Failed.', err);
        showError('🌐 Failed to fetch history.');
      }
    };
    fetchWinners();
  }, [page, limit, API_BASE]);

  // ----------------------- Fetch games & challenges -------------------------
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        setFetchingChallenge(true);
        const chainId = chain?.id ?? standardChain;
        const gameContract = getWaveFlipChallengeAddress(chainId);

        const _gameIdsResult = await readContract(config, {
          address: gameContract,
          abi: WaveFlipAbi,
          functionName: 'getGameIds',
          args: [],
          chainId
        });

        const [gamelen, _gameIds] = _gameIdsResult;
        setGameIds(_gameIds);

        let _gameMinTokenAmount = [];
        if (gamelen > 0) {
          await Promise.all(
            _gameIds.map(async (gid) => {
              const res = await readContract(config, {
                address: gameContract,
                abi: WaveFlipAbi,
                functionName: 'getGameInfo',
                args: [gid],
                chainId
              });
              _gameMinTokenAmount.push(Number(res[5]));
              return null;
            })
          );
        }
        setGameMinTokenAmount(_gameMinTokenAmount);

        const _challengeIdsResult = await readContract(config, {
          address: gameContract,
          abi: WaveFlipAbi,
          functionName: 'getChallengeIds',
          args: [],
          chainId
        });

        const [challengelen, challengeIds] = _challengeIdsResult;
        let _challengeInfo = [];
        if (challengelen > 0) {
          _challengeInfo = await Promise.all(
            challengeIds.map(async (cid) => {
              const res = await readContract(config, {
                address: gameContract,
                abi: WaveFlipAbi,
                functionName: 'getChallengeInfo',
                args: [cid],
                chainId
              });
              return {
                challengeId: cid,
                gameId: res[0],
                creator: res[1],
                challenger: res[2],
                isActive: res[3],
                result: res[4],
                createTime: res[5],
                drawTime: res[6],
                xpAmount: res[7],
              };
            })
          );
        }
        setHistoryChallenge(_challengeInfo);
      } catch (error) {
        console.error('Error fetching challenge info:', error);
        showError('⚠️ Init load failed.');
      } finally {
        setFetchingChallenge(false);
      }
    };

    fetchInitData();
  }, [chain, pending, updated, standardChain, WaveFlipAbi]);

  // -------------------------- Fetch XP token allowance ----------------------
  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        const chainId = chain?.id ?? standardChain;
        const _allowance = await readContract(config, {
          address: getXPTokenAddress(chainId),
          abi: WaveAbi,
          functionName: 'allowance',
          args: [address, getWaveFlipChallengeAddress(chainId)],
          chainId
        });
        setAllowance(_allowance?.toString?.() ?? String(_allowance ?? 0));
      } catch (err) {
        console.error('Allowance fetch failed:', err);
        setAllowance(0);
      }
    };
    if (address) fetchAllowance();
  }, [address, chain, pending, standardChain]);

  // ----------------------- Derive gameId from wager value -------------------
  useEffect(() => {
    if (wager && gameMinTokenAmount.length && gameIds.length) {
      const idx = gameMinTokenAmount.findIndex(v => v === wager);
      setNewGameId(idx !== -1 ? gameIds[idx] : null);
    } else {
      setNewGameId(null);
    }
  }, [wager, gameMinTokenAmount, gameIds]);

  // -------------------------------- Handlers --------------------------------
  const createChallengeHandler = async () => {
    const chainId = chain?.id ?? standardChain;
    if (!address) return showError('🔌 Connect wallet.');
    if (!newGameId) return showInfo('🪙 Please select a wager.', '🧩');
    if (pending) return showInfo('⏳ Please wait...', '🔄');

    try {
      setPending(true);
      const tx = await writeContract(config, {
        address: getWaveFlipChallengeAddress(chainId),
        abi: WaveFlipAbi,
        functionName: 'createChallenge',
        args: [newGameId, BigInt(wager), isHead],
        chainId
      });
      await waitForTransaction(config, { hash: tx });
      showSuccess('🎉 Challenge created.');
      setUpdated(u => u + 1);
    } catch (err) {
      console.error('Create failed:', err);
      showError('💥 Failed to create challenge.');
    } finally {
      setPending(false);
    }
  };

  const enterChallengeHandler = async (challengeId, xpAmount, side) => {
    const chainId = chain?.id ?? standardChain;
    if (!address) return showError('🔌 Connect wallet.');
    if (pending) return showInfo('⏳ Please wait...', '🔄');

    try {
      setPending(true);
      const tx = await writeContract(config, {
        address: getWaveFlipChallengeAddress(chainId),
        abi: WaveFlipAbi,
        functionName: 'enterChallenge',
        args: [challengeId, xpAmount, side],
        chainId
      });
      await waitForTransaction(config, { hash: tx });
      showSuccess('🎉 Challenge Joined.');
      setUpdated(u => u + 1);
    } catch (err) {
      console.error('Enter failed:', err);
      showError('💥 Failed to enter challenge.');
    } finally {
      setPending(false);
    }
  };

  const cancelChallengerHandler = async (challengeId) => {
    const chainId = chain?.id ?? standardChain;
    if (!address) return showError('🔌 Connect wallet.');
    if (pending) return showInfo('⏳ Please wait...', '🔄');

    try {
      setPending(true);
      const tx = await writeContract(config, {
        address: getWaveFlipChallengeAddress(chainId),
        abi: WaveFlipAbi,
        functionName: 'cancelChallenge',
        args: [challengeId],
        chainId
      });
      await waitForTransaction(config, { hash: tx });
      showSuccess('🧹 Challenge Canceled.');
      setUpdated(u => u + 1);
    } catch (err) {
      console.error('Canceling failed:', err);
      showError('💥 Failed to cancel challenge.');
    } finally {
      setPending(false);
    }
  };

  // Approve
  const approveHandler = async () => {
    const chainId = chain?.id ?? standardChain;
    if (!address) return showError('🔌 Connect wallet.');
    if (pending) return showInfo('⏳ Please wait...', '🔄');

    try {
      setPending(true);
      const approve = await writeContract(config, {
        address: getXPTokenAddress(chainId),
        abi: WaveAbi,
        functionName: 'approve',
        args: [getWaveFlipChallengeAddress(chainId), BigInt(1_000_000e18)],
        chainId,
        gasLimit: 300_000n
      });

      await waitForTransaction(config, { hash: approve });
      showSuccess('✅ Approve confirmed!', '🎯');
      setUpdated(u => u + 1);
    } catch (err) {
      console.error('Approve failed:', err);
      showError('💥 Failed to approve.');
    } finally {
      setPending(false);
    }
  };

  // ---------------------------- Realtime listeners --------------------------
  useEffect(() => {
    const chainId = chain?.id ?? standardChain;
    const RAW = process.env.REACT_APP_SEPINF_WSS_URL ?? '';
    const WSS_URL = RAW.trim().replace(/^"|"$/g, '');
    if (!WSS_URL) return;

    const contractAddress = getWaveFlipChallengeAddress(chainId);
    const provider = new ethers.providers.WebSocketProvider(WSS_URL);
    const contract = new ethers.Contract(contractAddress, WaveFlipAbi, provider);

    const handler = (
      challengeId,
      player1,
      player2,
      wager,
      result,
      winner,
      time,
      reward,
      event
    ) => {
      setEvents((prev) => [
        {
          challengeId,
          player1,
          player2,
          wager: wager.toString(),
          result,
          winner,
          time: time.toString(),
          reward: reward.toString(),
          txHash: event?.transactionHash || null,
        },
        ...prev
      ]);

      const winAddr = String(winner).toLowerCase();
      const me = String(address ?? '').toLowerCase();

      showSuccess(`🎉 Winner Drawn: ${shortenAddress(winner, 4)}!`);
      setUpdated(prev => prev + 1);
      setOpen(p => (winAddr === me ? 2 : 1));
    };

    const challengeUpdateHandler = () => {
      setUpdated((prev) => prev + 1);
    };

    contract.on('WinnerDrawn', handler);
    contract.on('GameCreated', challengeUpdateHandler);
    contract.on('ChallengeCreated', challengeUpdateHandler);
    contract.on('ChallengeCancelled', challengeUpdateHandler);

    // Cleanup
    return () => {
      try {
        if (contract === null || contract === undefined) return;
        // if (contract.)
        contract.off('WinnerDrawn', handler);
        contract.off('GameCreated', challengeUpdateHandler);
        contract.off('ChallengeCreated', challengeUpdateHandler);
        contract.off('ChallengeCancelled', challengeUpdateHandler);
        provider.destroy?.();
      } catch {
        /* no-op */
      }
    };
  }, [chain, standardChain, WaveFlipAbi, address]);


  // --- Render ---
  return (
    <>
      <TopBar />
      {/*Header*/}
      <div className="hero-area coinflip video-top video-medium">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex align-self-center">
              <div className="left-content">
                <div className="content">
                  <h1 className="title">
                    <span className="flip-text">Flip the Coin,</span>
                    <span className="win-text">Win Big!</span>
                  </h1>
                  <h3 className='sub-title'>CHALLENGE AND TEST YOUR LUCK.</h3>
                  <p className="text-start">
                    Test your luck with the ultimate coin flip game. Choose your side, place your XP, and see if fortune favors you!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-img2 d-block d-md-none">
                <img src="assets/images/pools/coinflip.png" alt="" />
              </div>
              <div className="hero-img d-none d-md-block">
                <img className="shape man" src="assets/images/coinflip.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="featured-game-before coinflip-gradient"></div>
      {/*create challenge*/}
      <section className='prize-pools coinflip activities'>
        <div className="wave-flip-card-container">
          <div className="row">
            <div className='col-lg-12'>
              <div className='wave-flip-card'>
                
                <div className="wave-flip-content">
                  <div className="wave-flip-header">
                    <div className="wave-flip-avatar">
                      <img src={normalizeUrl(currentAvatar)} alt="Current avatar" />
                    </div>
                    <div className="wave-flip-text">
                      <h4 className='wave-flip-title'>Wave Flip</h4>
                      <p className='wave-flip-subtitle'>50/50 CHANCE TO WIN BIG – PICK A SIDE AND FLIP THE COIN!</p>
                    </div>
                  </div>
                  
                  <div className="wave-flip-controls">
                    <div className="wager-section">
                      <span className="section-label">WAGER</span>
                      <div className="wager-options">
                        {gameMinTokenAmount.map((value, idx) => (
                          <div
                            key={value}
                            className={wager === value ? 'wager-option active' : 'wager-option'}
                            onClick={() => setWager(value)}
                          >
                            <img src="/logo.png" alt="" width={20} />
                            <span>{Number(value) / 1e18}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="choice-section">
                      <div className="choice-options">
                        <div
                          className={isHead ? "choice-option active" : "choice-option"}
                          onClick={() => setIsHead(true)}
                        >
                          <img src="/assets/images/game/head.png" alt="" width={20} />
                          <span>HEAD</span>
                        </div>
                        <div
                          className={!isHead ? "choice-option active" : "choice-option"}
                          onClick={() => setIsHead(false)}
                        >
                          <img src="/assets/images/game/tail.png" alt="" width={20} />
                          <span>TAIL</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="approve-section">
                      <button 
                        className="approve-btn" 
                        onClick={() => !pending && allowance > BigInt(wager) ? createChallengeHandler() : approveHandler()}
                      >
                        {allowance > BigInt(wager) ? 'CREATE CHALLENGE' : 'APPROVE'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*pending challenge*/}
      <div className="activities">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-heading">
                <h5 className="subtitle">
                  YOUR PENDING CHALLENGES
                </h5>
                <h2 className="title">
                  
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="tab-content">
                <div className="tab-pane fade show active" id="all-bets" role="tabpanel" aria-labelledby="all-bets-tab" >
                  <div className="responsive-table " style={{scrollbarWidth:"none"}}>
                    <table className="table" >
                      <tbody className = "text-center">
                        {historyChallenge.map((h, i) => (h.isActive && h.creator.userAddress === address?(
                          <tr key={h.id||i}>
                            <td >
                              <img src='assets/images/golden_clock.gif' alt='' width={40}/>
                            </td>
                            <td >
                              <img src={h.creator.side ? "/assets/images/game/head.png":"/assets/images/game/tail.png"} alt="" width={40} />
                              <span>{h.creator.side  ? " HEAD" : " TAIL"}</span>
                            </td>
                            <td >
                              <img src="/logo.png" alt="" width={40} />
                              <span>{Number(h.xpAmount) / 1e18}</span>
                            </td>
                            <td>
                              <span>{formatBlockTimestamp(Number(h.createTime))}</span>
                            </td>
                            <td>
                              <div className="count" onClick={() => allowance > h.xpAmount ? cancelChallengerHandler(h.challengeId) : approveHandler()}>
                                <img src='/assets/images/delete.png' width={10}/>
                              </div>
                            </td>
                          </tr>
                        ):null))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className='prize-pools'>
        <div className="container">
          <div className="row align-items-stretch rounded-5 p-4">
            <div className="col-lg-8 d-flex flex-column">
              <h3 className="fw-bold text-white mb-4 mt-3" style={{ letterSpacing: 1, fontSize: "2.5rem" }}>
                ACTIVE CHALLENGES
              </h3>
              <div className="col-lg-12 flex-grow-1 d-flex overflow-auto " >
                <div
                  className="d-flex flex-column flex-grow-1 overflow-auto responsive-table"
                  style={{
                    maxHeight:"50VH",
                    scrollbarWidth:"none"
                  }}>
                  {historyChallenge.filter(h => address!==undefined && h.isActive && h.creator.userAddress !== address).map((h, j) => (
                    <div
                      key={h.id || j}
                      className="rounded-4 mb-4 p-4"
                      style={{
                        width: "100%",
                        background: "url('/assets/images/card.png') no-repeat center center",
                        backgroundSize: "100% 100%",
                        minHeight: 300,
                        color: "#fff",
                        marginLeft: "-1%",
                      }}
                    >
                      <div className="d-flex align-items-center mb-3" style={{marginLeft: "4%"}}>
                        <div className="me-4"
                          style={{
                            width: 90,
                            height: 90,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "url('/assets/images/avatar-border.png') no-repeat center center",
                            backgroundSize: "cover",
                            padding: "8px"
                          }}
                        >
                          <img src="/assets/images/activeChallengeAvatar.png" alt="avatar" style={{ width: 60, height: 60, borderRadius: "50%" }} />
                        </div>
                        <div>
                          <div className="fw-bold" style={{ fontSize: "2rem", color: "#ffe872" }}>{shortenAddress(h.creator.userAddress,4)}</div>
                          <div className="fw-bold" style={{ fontSize: "1.4rem" }}>{formatBlockTimestamp(Number(h.createTime))}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justif  y-content-between mt-3" style={{marginLeft: "5%"}}>
                        {/* WAGER and SELECTION together */}
                        <div className="d-flex align-items-center gap-4">
                          {/* WAGER */}
                          <div>
                            <div className="fw-bold mb-2" style={{ fontSize: 16, color: "#fff" }}>WAGER</div>
                            <div className="d-flex align-items-center rounded-4 px-4 py-2" style={{ background: "#494fa9" }}>
                              <img src="/logo.png" alt="Wager" style={{ width: 36, marginRight: 8 }} />
                              <span className="fw-bold" style={{ fontSize: 28, color: "#ffe872" }}>{Number(h.xpAmount) / 1e18}</span>
                            </div>
                          </div>
                          
                          {/* SELECTION - Only show the selected choice */}
                          <div>
                            <div className="fw-bold mb-2" style={{ fontSize: 16, color: "#fff" }}>SELECTION</div>
                            <div
                              className="d-flex align-items-center px-4 py-2"
                              style={{
                                background: "#0d208bff",
                                color: "#ffe872",
                                border: "2px solid #ffe872",
                                borderRadius: "16px",
                                fontSize: 22
                              }}
                            >
                              <img 
                                src={h.creator.side ? "/assets/images/game/head.png" : "/assets/images/game/tail.png"} 
                                alt={h.creator.side ? "head" : "tail"} 
                                style={{ width: 28, marginRight: 8 }} 
                              />
                              <span>{h.creator.side ? "Head" : "Tail"}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Accept Button - Rectangular with border radius */}
                        <button
                          type="button"
                          className="px-4 py-3 fw-bold"
                          style={{
                            background: "#FBC950",
                            color: "#05092D",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            marginRight: "5%",
                            marginBottom: "-5%"
                          }}
                          disabled={pending || allowance <= h.xpAmount}
                          onClick={() => !pending && allowance > h.xpAmount ? enterChallengeHandler(h.challengeId, h.xpAmount, !h.creator.side) : approveHandler()}>
                          {allowance > h.xpAmount ? 'ACCEPT' : 'APPROVE'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leaderboard placeholder */}
            <div className="col-lg-4 d-flex">
              <div className="flex-grow-1">
                <div className="leaderboard-icon">
                  <img src="/assets/images/leaderboard.svg" alt="Leaderboard" width={60} height={60} />
                </div>
                <h3 className="fw-bold text-center mb-4 text-white mt-3" style={{ letterSpacing: 1 }}>
                  LEADERBOARD
                </h3>
                <div>
                  <SocketLeaderboard apiUrl = "/api/leaderboard" body = {{ gameType: 'challenge', page: 1, limit: 10 }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*coin flip history*/}
      <div className="activities">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-heading">
                <h5 className="subtitle">
                  
                </h5>
                <h2 className="title">
                  COIN FLIP HISTORY
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="tab-content">
                <div className="tab-pane fade show active" id="all-bets" role="tabpanel" aria-labelledby="all-bets-tab">
                  <div className="responsive-table " style={{scrollbarWidth:"none"}}>
                    <table className="table" >
                      <thead className = " active count text-center" >
                        <tr>
                          <th>
                            <span style={{ color: "#ffffff" }}>PLAYER1</span>
                          </th>
                          <th>
                            <span style={{ color: "#ffffff" }}>PLAYER2</span>
                          </th>
                          <th>
                            <span style={{ color: "#ffffff" }}>WAGER</span>
                          </th>
                          <th>
                            <span style={{ color: "#ffffff" }}>RESULT</span>
                          </th>
                          <th>
                            <span style={{ color: "#ffffff" }}>WINNER</span>
                          </th>
                          <th>
                            <span style={{ color: "#ffffff" }}>DATE / TIME</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className = "text-center active count ">
                        {events.map((e, k) => (
                          <tr key={e.id||k}>
                            <td >
                              {shortenAddress(e.player1,4)}
                            </td>
                            <td >
                              {shortenAddress(e.player2,4)}
                            </td>
                            <td>
                              <img src="/logo.png" alt="" width={40} />
                              {Number(e.wager) / 1e18}
                            </td>
                            <td>
                              <img src={e.result ? "/assets/images/game/head.png":"/assets/images/game/tail.png"} alt="" width={40} />
                              {e.result  ? " HEAD" : " TAIL"}
                            </td>
                            <td >
                              {shortenAddress(e.winner,4)}
                            </td>
                            <td>
                              {formatBlockTimestamp(Number(e.time))}
                            </td>
                          </tr>
                        ))}
                        {coinflipHistory.map((item, idx) => (
                          <tr key={item._id || idx}>
                            <td>
                              {item.winner.role=="creator"?shortenAddress(item.winner.username,4):shortenAddress(item.loser.username,4)}
                            </td>
                            <td>
                              {item.winner.role=="challenger"?shortenAddress(item.winner.username,4):shortenAddress(item.loser.username,4)}
                            </td>
                            <td className='w-full'>
                              <img src="/logo.png" alt="" width={40}/> 
                              {item.amount/1e18}
                            </td>
                            <td>
                              <img src={item.result ? "/assets/images/game/head.png":"/assets/images/game/tail.png"} alt="" width={40} />
                              {item.result  ? " HEAD" : " TAIL"}
                            </td>
                            <td>
                              {shortenAddress(item.winner.username,4)}
                            </td>
                            <td>
                              {formatDatetime(new Date(item.createdAt))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-end my-3">
                      <nav>
                        <ul className="pagination mb-0 bg-grey bg-gradient rounded-pill shadow-sm px-2">
                          {/* Prev button */}
                          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link bg-transparent border-0 text-white"
                              onClick={() => setPage(page - 1)}
                              disabled={page === 1}
                            >
                              <i className="fas fa-chevron-left"></i>
                            </button>
                          </li>

                          {/* Page info */}
                          <li className="page-item disabled">
                            <span className="page-link bg-transparent border-0 text-light fw-bold">
                              Page {page} of {totalPages}
                            </span>
                          </li>

                          {/* Next button */}
                          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link bg-transparent border-0 text-white"
                              onClick={() => setPage(page + 1)}
                              disabled={page === totalPages}
                            >
                              <i className="fas fa-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PendingModal show={pending || isFetchingChallenge} imageSrc="/assets/images/pending.gif"/>
      <div id="modal-root"></div>
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
  );
}

export default CoinFlip;
