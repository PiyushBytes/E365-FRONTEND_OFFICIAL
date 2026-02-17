import api from './axios';
// API FOR ARTIST
export const initChatbot = (data) => api.post('/client/bot/', data);

export const sendMessage = (data) => api.post('/client/bot/', data);
// API FOR CLIENT

export const notifyArtist = (data) => api.get('/artist/notify-artist/', { artist_name : data });
