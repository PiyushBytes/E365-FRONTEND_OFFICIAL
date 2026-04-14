// ─── api/notifications.js ─────────────────────────────────────────────────────
// Project Manager (Event Manager) ke dashboard ke liye notification aur request APIs.
// PM ko incoming client requests inbox mein milti hain — yeh sab yahan se aata hai.
// useProjectManagerData.js hook in functions ko call karta hai.
import api from "./axios";

// Purani notifications ki list fetch karo (history ke liye)
export const getNotificationHistory = () =>
  api.get("/api/notifications/");

// PM ke liye saare incoming chatbox/event requests fetch karo (old unoptimized way)
export const getPMRequests = () =>
  api.get("/api/chat/chatboxes/");

// Naya optimized way: PM ke liye saari event queries directly fetch karo
export const getAllQueries = () =>
  api.get("/api/query/all/");

// Ek specific request ki poori detail fetch karo
// Client ka naam, event summary, messages — sab yahan se milta hai
export const getPMRequestDetail = (chatboxId) =>
  api.get(`/api/chat/chatboxes/${chatboxId}/`);

// Notification ko "padha hua" mark karo — unread count kam karne ke liye
export const markNotificationRead = (notificationId) =>
  api.patch(`/api/notifications/${notificationId}/read/`);

// Saari notifications ko ek sath read mark karo
// (Screenshot says /api/notifications/{id}/read-all/ but usually read-all doesn't take ID, using standard route)
export const markAllNotificationsRead = () =>
  api.patch(`/api/notifications/read-all/`);

// Unread messages ka count fetch karo
export const getUnreadNotificationCount = () =>
  api.get(`/api/notifications/unread-count/`);

// Kisi request ko cancel kar do (PM ne reject kiya ya client ne withdraw kiya)
// Yeh chatbox ko backend se permanently delete karta hai
export const cancelPMRequest = (requestId) =>
  api.delete(`/api/chat/chatboxes/${requestId}/`);