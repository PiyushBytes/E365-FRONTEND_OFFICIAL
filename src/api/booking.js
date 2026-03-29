import api from './axios';

export const getBookings = (params) => api.get('/booking/bookings/', { params });

export const respondToBooking = (bookingId, responseData) =>
  api.post(`/booking/bookings/${bookingId}/respond/`, responseData);

export const processPayment = (bookingId, paymentData) =>
  api.post(`/booking/bookings/${bookingId}/payment/`, paymentData);
