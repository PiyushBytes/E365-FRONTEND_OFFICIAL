// Artist panel ke liye saara fetching logic is hook ke andar hai
import { useState, useEffect } from "react";
import { getBookings, respondToBooking } from "../api/booking";

const CLIENT_IMAGES = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956",
];

export function useArtistData(user, activeTab) {
  // Artist ke pass aane wali requests aur booking states
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, pendingRequests: 0, acceptedBookings: 0, revenue: "₹0K" });
  const [available, setAvailable] = useState(true); // Artist abhi available hai ya nahi?

  // Jab user login ho aur explicitly requests tab khula ho, uski saari details api se mangwao
  useEffect(() => {
    if (user && activeTab === "requests") {
      getBookings({ username: user.username })
        .then(res => setNotifications(Array.isArray(res.data?.notifications) ? res.data.notifications : (Array.isArray(res.data) ? res.data : [])))
        .catch(console.error);
    }
    
    if (activeTab === "dashboard") {
      // Stats json se load kar rahe hain (dummy/fallback data)
      fetch("/static/artist_dashboard_count.json")
        .then(res => res.json())
        .then(data => {
          setStats({ totalBookings: data?.totalBookings ?? 0, pendingRequests: data?.pendingRequests ?? 0, acceptedBookings: data?.acceptedBookings ?? 0, revenue: data?.revenue ?? "₹0K" });
          // Har request par ek dummy user profile pic laga do
          setRequests((data.requests || []).map((req, i) => ({ ...req, clientImg: CLIENT_IMAGES[i % CLIENT_IMAGES.length] })));
        })
        .catch(console.error);
    }
  }, [user, activeTab]);

  // Agar artist ne booking accept karli
  const handleAccept = async (req) => {
    try {
      await respondToBooking(req.id, { action: "accept", artist_name: user?.username, client_name: req.name || req.client_name, event_type: req.eventType || req.event_type });
    } catch (err) { console.error(err); }
  };

  // UI ko chalane ke liye zaroori variables return karo
  return { notifications, requests, stats, available, setAvailable, handleAccept };
}
