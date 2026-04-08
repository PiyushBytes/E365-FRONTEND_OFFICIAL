// ─── api/websocket.js ─────────────────────────────────────────────────────────
// Real-time WebSocket connections — live chat aur notifications ke liye.
// Step 4:  ws://ws/chat/{id}/             → BOT ke replies live milte hain
// Step 10: ws://ws/notifications/{uid}/   → sabko live notifications milti hain
//
// Kaise use karna hai:
//   const ws = connectChatSocket(chatboxId, onMessage, onError);
//   ws.close();  // component unmount pe band karo
import { env } from "../config/env";

// HTTP URL ko WebSocket URL mein convert karo (https→wss, http→ws)
function getWsBase() {
  const url = env.API_URL || "";
  return url.replace(/^https/, "wss").replace(/^http/, "ws");
}

// Chat ka live socket — BOT ke jawab real-time mein aayenge
export function connectChatSocket(chatboxId, onMessage, onError) {
  const ws = new WebSocket(`${getWsBase()}/ws/chat/${chatboxId}/`);
  ws.onmessage = (event) => {
    try { onMessage(JSON.parse(event.data)); }
    catch { onMessage({ text: event.data }); }
  };
  ws.onerror = (e) => onError?.(e);
  return ws; // Caller ko ws object do taaki woh close kar sake
}

// Notification ka live socket — naye events real-time mein dikhenge
export function connectNotificationSocket(userId, onNotification) {
  const token = localStorage.getItem("token");
  const ws = new WebSocket(`${getWsBase()}/ws/notifications/${userId}/?token=${token}`);
  ws.onmessage = (event) => {
    try { onNotification(JSON.parse(event.data)); }
    catch { onNotification({ message: event.data }); }
  };
  ws.onerror = (e) => console.error("[WS] Notification error:", e);
  return ws;
}
