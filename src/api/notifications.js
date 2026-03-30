import api from './axios';

// Purani notifications fetch karo
export const getNotificationHistory = () => api.get('/api/notifications/');

// Saare chatboxes fetch karo (PM requests)
export const getPMRequests = () => api.get('/api/chat/chatboxes/');

// Ek specific chatbox ki detail fetch karo
export const getPMRequestDetail = (chatboxId) => api.get(`/api/chat/chatboxes/${chatboxId}/`);

// Notification read mark karo
export const markNotificationRead = (notificationId) =>
  api.patch(`/api/notifications/${notificationId}/read/`);

// Request cancel/delete karo
export const cancelPMRequest = (requestId) =>
  api.delete(`/api/chat/chatboxes/${requestId}/`);