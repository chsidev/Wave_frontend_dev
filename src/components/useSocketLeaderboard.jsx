// useSocketLeaderboard.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import socket from "./socket.jsx";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.REACT_APP_API_BASE ||
  "http://192.168.0.114:5000"
).replace(/\/$/, "");

const abs = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function useSocketLeaderboard(
  path = "/api/leaderboard",
  body = { gameType: '', page: 1, limit: 10 }
) {
  // console.log("useSocketLeaderboard", path, body);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // stable string for deps (so we can pass objects safely)
  const bodyKey = useMemo(() => JSON.stringify(body ?? {}), [body]);

  const fetchOnce = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyKey,
          signal,
        });
        if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
        const json = await res.json();

        // Normalize avatar to absolute URL (only for /api/leaderboard response shape)
        if (json?.data?.leaderboard?.length) {
          json.data.leaderboard = json.data.leaderboard.map((row) => ({
            ...row,
            avatar: abs(row.avatar),
          }));
        }

        setLeaderboard(json.data?.leaderboard || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Failed to load leaderboard");
          setLeaderboard([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [path, bodyKey]
  );

  // initial load + on deps change
  useEffect(() => {
    const ctrl = new AbortController();
    fetchOnce(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchOnce]);

  // live refresh on broadcast
  useEffect(() => {
    const onUpdate = () => {
      // simplest & safest is to refetch; payload shapes can vary
      fetchOnce();
    };
    socket.on("leaderboardUpdate", onUpdate);
    return () => socket.off("leaderboardUpdate", onUpdate);
  }, [fetchOnce]);

  const refetch = useCallback(() => fetchOnce(), [fetchOnce]);

  return { leaderboard, loading, error, refetch };
}
