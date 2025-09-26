import { io } from "socket.io-client";

const API_BASE = (
  process.env.REACT_APP_API_BASE
).replace(/\/$/, '');
// Replace with your backend URL
const socket = io(API_BASE, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

export default socket;