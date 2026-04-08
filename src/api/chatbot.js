// ─── api/chatbot.js ───────────────────────────────────────────────────────────
// Client aur Project Manager ke beech ki saari chat functionality yahan hai.
// Flow: Client chatbot se baat karta hai → summary banta hai → PM ko submit hota hai.
// Yeh ChatWidget.jsx, MessagesTab.jsx, aur PMChatModal.jsx mein use hota hai.
import api from "./axios";

// Naya chatbox shuru karo — client jab pehli baar chat start kare
// Response mein chatbox ID milta hai jise localStorage mein save karo
export const initChatbox = () =>
  api.post("/api/chat/chatboxes/");

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

// Ek specific chatbox ke saare messages fetch karo
// User jab kisi chat pe click kare, toh conversation history load hogi
export const getChatMessages = (chatboxId) =>
  api.get(`/api/chat/chatboxes/${chatboxId}/messages/`);

// Client ne saari details confirm kar li — ab formally PM ko request bhejo
// Iske baad PM dashboard pe nai notification dikhi degi
export const submitRequestToPM = (chatboxId) =>
  api.post(`/api/chat/chatboxes/${chatboxId}/submit-request/`);