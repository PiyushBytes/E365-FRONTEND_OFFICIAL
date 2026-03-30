import api from './axios';

// ================= CREATE CHATBOX =================
export const initChatbox = () => {
  return api.post('/api/chat/chatboxes/');
};

// ================= SEND MESSAGE =================
export const sendChatMessage = (chatboxId, message) => {
  return api.post(
    `/api/chat/chatboxes/${chatboxId}/messages/`,
    {
      content: message,
    }
  );
};

// ================= GET SUMMARY =================
export const getChatboxSummary = (chatboxId) => {
  return api.get(
    `/api/query/chatboxes/${chatboxId}/query/summary/`
  );
};

// ================= NOTIFY ARTIST =================
export const notifyArtist = (data) => {
  return api.get('/api/artist/notify-artist/', {
    params: {
      artist_name: data,
    },
  });
};

// ================= GET ALL CHATBOXES (Client ke saare chats) =================
export const getAllChatboxes = () => {
  return api.get('/api/chat/chatboxes/');
};

// ================= GET MESSAGES OF A CHATBOX =================
export const getChatMessages = (chatboxId) => {
  return api.get(`/api/chat/chatboxes/${chatboxId}/messages/`);
};

// ================= SUBMIT REQUEST TO PM =================
// Jab client saari details de de, yeh call hoga
export const submitRequestToPM = (chatboxId) => {
  return api.post(`/api/chat/chatboxes/${chatboxId}/submit-request/`);
};