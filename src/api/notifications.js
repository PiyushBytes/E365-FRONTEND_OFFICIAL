// ─── api/notifications.js ─────────────────────────────────────────────────────
// Project Manager (Event Manager) ke dashboard ke liye notification aur request APIs.
// PM ko incoming client requests inbox mein milti hain — yeh sab yahan se aata hai.
// useProjectManagerData.js hook in functions ko call karta hai.
import api from "./axios";

// Purani notifications ki list fetch karo (history ke liye)
export const getNotificationHistory = () =>
  api.get("/api/notifications/");

// PM ke liye saare incoming chatbox/event requests fetch karo
// Yeh list PM ke dashboard ka "inbox" hai
export const getPMRequests = () =>
  api.get("/api/chat/chatboxes/");

// Ek specific request ki poori detail fetch karo
// Client ka naam, event summary, messages — sab yahan se milta hai
export const getPMRequestDetail = (chatboxId) =>
  api.get(`/api/chat/chatboxes/${chatboxId}/`);

// Notification ko "padha hua" mark karo — unread count kam karne ke liye
export const markNotificationRead = (notificationId) =>
  api.patch(`/api/notifications/${notificationId}/read/`);

// Kisi request ko cancel kar do (PM ne reject kiya ya client ne withdraw kiya)
// Yeh chatbox ko backend se permanently delete karta hai
export const cancelPMRequest = (requestId) =>
  api.delete(`/api/chat/chatboxes/${requestId}/`);