import React from "react";
import useSocketLeaderboard from "./useSocketLeaderboard"; 
import { shortenAddress } from '../utils/constants.ts';

function SocketLeaderboard({apiUrl, body}) {
  const { leaderboard, loading, error, refetch } =
  useSocketLeaderboard(apiUrl, body/*{ gameType: true, page: 1, limit: 10 }*/);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>{error}</p>;
  
  return (
    
    <div className="table-container">
      {leaderboard.map((entry, index) => (
        <div className="leaderboard-row" key={entry.id||index}>
          <div className="avatar-column">
            <img src={entry.avatar} alt="Avatar" className="avatar" />
          </div>
          <div className="name-column">
            <span className="name-placeholder">{shortenAddress(entry.address, 4)}</span>
          </div>
          <div className="points-column">
            <img src="/logo.png" alt="Logo" className="points-logo" />
            <span className="points-value">{(entry.totalReward)/1e18}</span>
          </div>
        </div>
      ))}
    </div>
    
  );
}

export default SocketLeaderboard;