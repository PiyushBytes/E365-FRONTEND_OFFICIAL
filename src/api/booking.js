// ─── api/booking.js ───────────────────────────────────────────────────────────
// Booking aur payment se related saari API calls yahan hain.
// Backend flow: Step 7 → 8 → 9
//   GET  /api/booking/bookings/              → artist sees requests
//   POST /api/booking/bookings/{id}/respond/  → artist accepts/declines
//   POST /api/booking/bookings/{id}/payment/  → client makes payment
import api from "./axios";

// Step 7: Artist ke liye saari booking requests fetch karo
export const getBookings = (params) =>
  api.get("/api/booking/bookings/", { params });

// Step 8: Artist booking accept ya decline kare
export const respondToBooking = (bookingId, responseData) =>
  api.post(`/api/booking/bookings/${bookingId}/respond/`, responseData);

// Step 9: Client payment process kare booking confirm karne ke liye
export const processPayment = (bookingId, paymentData) =>
  api.post(`/api/booking/bookings/${bookingId}/payment/`, paymentData);

// Fetch booking details by chatbox ID - used in PM dashboard to see selected artist
export const getBookingByChatbox = (chatboxId) =>
  api.get("/api/booking/bookings/", { params: { chatbox: chatboxId } });
