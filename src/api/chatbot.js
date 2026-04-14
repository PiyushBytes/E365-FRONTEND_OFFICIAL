// ─── api/chatbot.js ───────────────────────────────────────────────────────────
// Client aur Project Manager ke beech ki saari chat functionality yahan hai.
// Flow: Client chatbot se baat karta hai → summary banta hai → PM ko submit hota hai.
// Yeh ChatWidget.jsx, MessagesTab.jsx, aur PMChatModal.jsx mein use hota hai.
import api from "./axios";

// Naya chatbox shuru karo — client jab pehli baar chat start kare
// Response mein chatbox ID milta hai jise localStorage mein save karo
export const initChatbox = (initialMessage = "") => {
  const payload = initialMessage ? { initial_message: initialMessage } : {};
  return api.post("/api/chat/chatboxes/", payload);
};

// Chatbox mein ek message send karo (This triggers the bot via the nested messages route per API doc)
export const sendChatMessage = (chatboxId, message) =>
  api.post(`/api/chat/chatboxes/${chatboxId}/messages/`, { content: message });

// Chatbox ka AI-generated summary fetch karo
// Summary mein event details hoti hain — event type, date, budget, etc.
// PM dashboard mein yahi data cards pe dikhta hai
export const getChatboxSummary = (chatboxId) =>
  api.get(`/api/query/chatboxes/${chatboxId}/query/summary/`);

// Kisi specific artist ko notify karo
// data = artist ka naam (string)
export const notifyArtist = (data) =>
  api.get("/api/artist/notify-artist/", { params: { artist_name: data } });

// Client ke saare active chatboxes ki list lao
// Messages tab mein inbox dikhane ke liye use hota hai
export const getAllChatboxes = () =>
  api.get("/api/chat/chatboxes/");

// Full history fetch (or general chatbox detail sync)
export const getChatMessages = async (chatboxId) => {
  const res = await api.get(`/api/chat/chatboxes/${chatboxId}/`);
  // Handle backend returning { messages: [...] } or just the array directly
  const messages = res.data?.messages || (Array.isArray(res.data) ? res.data : []);
  return { data: messages };
};

// Fast poll — Ab hum single detail route se hi saara historical + naya data lenge
export const getLatestMessages = async (chatboxId) => {
  const res = await api.get(`/api/chat/chatboxes/${chatboxId}/`);
  const messages = res.data?.messages || (Array.isArray(res.data) ? res.data : []);
  return { data: messages };
};

// Client ne saari details confirm kar li — ab formally PM ko request bhejo
// Iske baad PM dashboard pe nai notification dikhi degi
export const submitRequestToPM = (chatboxId) =>
  api.post(`/api/chat/chatboxes/${chatboxId}/submit-request/`);

// ─── PROJECT MANAGER HANDOFF ENDPOINTS ────────────────────────────────────────

// PM chatbox mein enter karta hai — BOT pause ho jayega
export const enterChatbox = (chatboxId) => 
  api.post(`/api/chat/chatboxes/${chatboxId}/em-enter/`);

// PM chatbox se exit karta hai — BOT resume ho jayega
export const exitChatbox = (chatboxId) => 
  api.post(`/api/chat/chatboxes/${chatboxId}/em-exit/`);

// PM client ko direct message bhejta hai (Bot silence rahega)
// Body: { content: "message string" }
export const sendPMReply = (chatboxId, message) => 
  api.post(`/api/chat/chatboxes/${chatboxId}/em-reply/`, { content: message });