// ─── api/booking.js ───────────────────────────────────────────────────────────
// Booking aur payment se related saari API calls yahan hain.
// Artist dashboard mein incoming requests aur payments dono yahi se handle hote hain.
import api from "./axios";

// Artist ke liye saari bookings fetch karo
// params mein { username: "artist_name" } bhejo
export const getBookings = (params) =>
  api.get("/booking/bookings/", { params });

// Artist booking ke response pe "accept" ya "decline" kare
// responseData mein { action, artist_name, client_name, event_type } hona chahiye
export const respondToBooking = (bookingId, responseData) =>
  api.post(`/booking/bookings/${bookingId}/respond/`, responseData);

// Booking ka payment process karo
// paymentData mein payment details hongi (amount, method, etc.)
export const processPayment = (bookingId, paymentData) =>
  api.post(`/booking/bookings/${bookingId}/payment/`, paymentData);
