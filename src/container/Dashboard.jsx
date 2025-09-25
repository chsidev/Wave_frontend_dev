import React, { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { readContract } from '@wagmi/core';
import { formatUnits } from 'viem';
import { getWavePrizePoolAddress, getXPTokenAddress } from '../utils/addressHelpers.ts';
import { config } from '../config';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

// -------- Backend base URL (non-Vite safe) --------
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.REACT_APP_API_BASE ||
  'http://192.168.0.67:5000'
).replace(/\/$/, '');

// -------- Small helpers --------
const shorten = (addr, n = 4) =>
  !addr ? '' : `${addr.slice(0, 2 + n)}…${addr.slice(-n)}`;

const toBig = (v) => (typeof v === 'bigint' ? v : BigInt(v));
const fmtNum = (n) => new Intl.NumberFormat().format(Number(n || 0));
const fmtXP = (n) => new Intl.NumberFormat().format(Number(n || 0)); // XP is integer; adjust if fractional

export default function Dashboard() {
  // ---- Wallet / Chain ----
  const { address, isConnected, chain } = useAccount();
  const TARGET_CHAIN_ID = chain !== undefined ? chain.id : 97; // BSC Testnet default

  // ---- Contract addresses ----
  const waveTokenAddress = useMemo(() => getXPTokenAddress(TARGET_CHAIN_ID), [TARGET_CHAIN_ID]);
  const prizePoolAddress = useMemo(() => getWavePrizePoolAddress(TARGET_CHAIN_ID), [TARGET_CHAIN_ID]);

  // ---- On-chain balance/allowance ----
  const [xpBalance, setXpBalance] = useState(0n);
  const [allowance, setAllowance] = useState(0n);
  const [isLoadingChain, setIsLoadingChain] = useState(false);

  // ---- Backend dashboard data (per wallet) ----
  const [summary, setSummary] = useState({
    totalEarned: 0,   // sum of rewards where result = win (this wallet)
    totalSpent: 0,    // sum of all bet amounts including pending (this wallet)
    activeTickets: 0, // sum of pending bet amounts (this wallet)
  });
  const [raiders, setRaiders] = useState([]); // winners feed (global)
  const [loadingApi, setLoadingApi] = useState(false);

  const canQueryContracts = Boolean(isConnected && address && waveTokenAddress && prizePoolAddress);

  // ---- Formatters ----
  const format18 = (val) => {
    try {
      return formatUnits(toBig(val), 18);
    } catch {
      return '0';
    }
  };

  // ---- Fetch XP token balance / allowance (chain-reads) ----
  useEffect(() => {
    (async () => {
      if (!canQueryContracts) return;
      setIsLoadingChain(true);
      try {
        const [_allowance, _balance] = await Promise.all([
          readContract(config, {
            address: waveTokenAddress,
            abi: [
              // minimal ERC20
              { name: 'allowance', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
            ],
            functionName: 'allowance',
            args: [address, prizePoolAddress],
            chainId: TARGET_CHAIN_ID,
          }),
          readContract(config, {
            address: waveTokenAddress,
            abi: [
              { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }] },
            ],
            functionName: 'balanceOf',
            args: [address],
            chainId: TARGET_CHAIN_ID,
          }),
        ]);
        setAllowance(_allowance);
        setXpBalance(_balance);
      } catch (err) {
        console.error('Failed to read token data:', err);
        toast.error('Could not query token data (wrong network or RPC).');
      } finally {
        setIsLoadingChain(false);
      }
    })();
  }, [canQueryContracts, address, waveTokenAddress, prizePoolAddress, TARGET_CHAIN_ID]);

  // ---- Fetch backend dashboard data ----
  async function fetchSummaryAndRaiders(wallet) {
    try {
      setLoadingApi(true);

      const [sumRes, raidersRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/summary/${wallet.toLowerCase()}`, { credentials: 'omit' }),
        fetch(`${API_BASE}/api/dashboard/raiders?limit=50`, { credentials: 'omit' }),
      ]);

      if (!sumRes.ok) throw new Error(`Summary HTTP ${sumRes.status}`);
      if (!raidersRes.ok) throw new Error(`Raiders HTTP ${raidersRes.status}`);

      const sum = await sumRes.json();
      const rds = await raidersRes.json();

      setSummary({
        totalEarned: format18(Number(sum.totals?.totalXpEarned || 0)),
        totalSpent: format18(Number(sum.totals?.totalXpSpent || 0)),
        activeTickets: format18(Number(sum.totals?.activeTickets || 0)),
      });
      setRaiders(Array.isArray(rds) ? rds : []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      toast.error('Could not load dashboard data from server.');
      setSummary({ totalEarned: 0, totalSpent: 0, activeTickets: 0 });
      setRaiders([]);
    } finally {
      setLoadingApi(false);
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchSummaryAndRaiders(address);
    } else {
      setSummary({ totalEarned: 0, totalSpent: 0, activeTickets: 0 });
      setRaiders([]);
    }
    // You can also poll occasionally if you want:
    // const t = setInterval(() => { if (address) fetchSummaryAndRaiders(address); }, 15000);
    // return () => clearInterval(t);
  }, [isConnected, address]);

  const wrongNetwork = isConnected && chain?.id && chain.id !== TARGET_CHAIN_ID;

  return (
    <>
      <TopBar />
      <div className="featured-game-before dashboard-gradient"></div>
      <section className="dashboard-area">
        <div className="container">
          <h4 className="page-title">Your Dashboard</h4>
          <p>
            Track your progress, monitor your rewards, and stay ahead in the game. Everything you need to know
            about your performance is right here.
          </p>

          {isConnected ? (
            wrongNetwork ? (
              <div className="alert alert-warning" role="alert" style={{ marginBottom: 16 }}>
                You are connected to <b>{chain?.name ?? chain?.id}</b>. This dashboard reads data on{' '}
                <b>BSC Testnet (97)</b> for on-chain calls. Switch your wallet to BSC Testnet if you want to
                transact; read calls are already pointed to 97.
              </div>
            ) : null
          ) : (
            <div className="alert alert-info" role="alert" style={{ marginBottom: 16 }}>
              Connect your wallet to see live balances and dashboard stats.
            </div>
          )}

          <h4 className="sub-title">XP & Ticket Tracker</h4>

          <div className="xp-status row">
            <div className="col-lg-4 col-md-6">
              <div className="xp-box">
                <div className="balance">
                  <img src="/logo.png" alt="logo" width={64} height={64} />
                  <span>{loadingApi ? '—' : fmtXP(summary.totalEarned)}</span>
                </div>
                <p>Total XP Earned</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="xp-box">
                <div className="balance">
                  <img src="/logo.png" alt="logo" width={64} height={64} />
                  <span>{loadingApi ? '—' : fmtXP(summary.totalSpent)}</span>
                </div>
                <p>Total XP Spent</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="xp-box">
                <div className="balance">
                  <img src="/logo.png" alt="logo" width={64} height={64} />
                  <span>{loadingApi ? '—' : fmtXP(summary.activeTickets)}</span>
                </div>
                <p>Active Tickets</p>
              </div>
            </div>
          </div>

          <h4 className="sub-title">Claim Bonus</h4>
          <p className="description">
            We update our site regularly; more and more winners are added every day! To locate the most recent
            winner&apos;s information
          </p>

          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="single-awards xp-balance">
                <div className="content">
                  <div className="icon">
                    <img src="/logo.png" width={80} alt="Wave" />
                  </div>
                  <h4 className="title">XP Balance</h4>

                  <div className="balance">
                    {isLoadingChain ? 'Loading…' : isConnected ? fmtNum(format18(xpBalance)) : '0'}
                  </div>

                  <button
                    type="button"
                    className="mybtn2 xp-balance"
                    onClick={() => toast('Buy flow coming soon')}
                  >
                    Buy More
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="single-awards referral-members">
                <div className="content">
                  <div className="icon">
                    <img src="assets/images/awards/ref.gif" alt="referral" />
                  </div>
                  <h4 className="title">Referral Members</h4>
                  <p>
                    <i className="fas fa-users" /> 0
                  </p>
                  <button
                    type="button"
                    className="mybtn2 referral-members"
                    onClick={() => toast('Referral details coming soon')}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="single-awards claim-bonus">
                <div className="content">
                  <div className="icon">
                    <img src="assets/images/awards/claim.gif" width={80} alt="claim" />
                  </div>
                  <h4 className="title">Claim Bonus</h4>
                  <div className="balance">0</div>
                  <button
                    type="button"
                    className="mybtn2 claim-bonus"
                    onClick={() => toast('Claim flow coming soon')}
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="activities">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                  <div className="section-heading">
                    <h5 className="subtitle">The Smarter Way</h5>
                    <h2 className="title">Wave Raiders</h2>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="all-bets"
                      role="tabpanel"
                      aria-labelledby="all-bets-tab"
                    >
                      <div className="responsive-table">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">USER</th>
                              <th scope="col">XP USED</th>
                              <th scope="col">GAME</th>
                              <th scope="col">PROFIT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {raiders.length === 0 ? (
                              <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                  {loadingApi ? 'Loading…' : 'No winners yet.'}
                                </td>
                              </tr>
                            ) : (
                              raiders.map((row, idx) => (
                                <tr key={idx}>
                                  <td>{shorten(row.address, 4)}</td>
                                  <td>
                                    <img src="/logo.png" alt="" />
                                    {" "+format18(row.xp_used)}
                                  </td>
                                  <td> {row.game}</td>
                                  <td>
                                    <img src="/logo.png" alt="" />
                                     {" "+format18(row.profit)}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Bottom Animation */}
      <div className="bottom-animation-container">
        <div className="bottom-animation-gradient"></div>
      </div>
      <Footer />
    </>
  );
}
