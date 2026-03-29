import api from './axios';

// API FOR CLIENT CHAT
export const initChatbox = () => api.post('/chat/chatboxes/');

export const sendChatMessage = (chatboxId, text) =>
  api.post(`/chat/chatboxes/${chatboxId}/messages/`, { text });

export const getChatboxSummary = (chatboxId) =>
  api.get(`/query/chatboxes/${chatboxId}/query/summary/`);

// API FOR NOTIFICATIONS / ARTIST (will be replaced by websockets/proper endpoints)
export const notifyArtist = (data) => api.get('/artist/notify-artist/', { artist_name: data });
