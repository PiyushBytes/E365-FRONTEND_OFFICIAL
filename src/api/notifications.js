import api from './axios';

export const getNotificationHistory = () => api.get('/notifications/');
