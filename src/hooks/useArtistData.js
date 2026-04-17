// Artist panel ke liye saara fetching logic is hook ke andar hai
import { useState, useEffect } from "react";
import { getBookings, respondToBooking } from "../api/booking";
import { getArtistProfile } from "../api/artistProfile";
import { useAuth } from "../context/AuthContext";

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
  const [profile, setProfile] = useState(null); // Artist profile data from backend
  const [profileLoading, setProfileLoading] = useState(false);
  const { setUser } = useAuth();

  // Jab user login ho aur explicitly requests tab khula ho, uski saari details api se mangwao
  useEffect(() => {
    if (user && activeTab === "requests") {
      getBookings({ username: user.username })
        .then(res => setNotifications(Array.isArray(res.data?.notifications) ? res.data.notifications : (Array.isArray(res.data) ? res.data : [])))
        .catch(console.error);
    }

    if (activeTab === "dashboard") {
      // Artist profile ko optimise tarike se fetch karo (duplicate call avoid karo)
      if (user?.artist_profile_data) {
        setProfile(user.artist_profile_data);
        if (user.artist_profile_data?.is_available !== undefined) {
          setAvailable(user.artist_profile_data.is_available);
        }
      } else {
        setProfileLoading(true);
        getArtistProfile()
          .then(data => {
            const profileData = data?.profile || data;
            setProfile(profileData);
            if (setUser) {
              setUser(prev => ({ ...prev, artist_profile_data: profileData }));
            }
            if (profileData?.is_available !== undefined) {
              setAvailable(profileData.is_available);
            }
          })
          .catch(console.error)
          .finally(() => setProfileLoading(false));
      }

      // Stats dummy data locally set karo to avoid internal API calls
      const dummyData = {
        totalBookings: 124,
        pendingRequests: 5,
        acceptedBookings: 8,
        revenue: "₹4.5L",
        requests: [
          {
            id: "REQ-001",
            name: "Rajesh Sharma",
            eventType: "Corporate Event",
            date: "OCT 25",
            location: "Mumbai, MH",
            offer: "₹1,50,000"
          },
          {
            id: "REQ-002",
            name: "Priya Mehta",
            eventType: "Wedding Sangeet",
            date: "NOV 12",
            location: "Delhi, NCR",
            offer: "₹2,00,000"
          }
        ]
      };
      
      setStats({ totalBookings: dummyData.totalBookings, pendingRequests: dummyData.pendingRequests, acceptedBookings: dummyData.acceptedBookings, revenue: dummyData.revenue });
      setRequests(dummyData.requests.map((req, i) => ({ ...req, clientImg: CLIENT_IMAGES[i % CLIENT_IMAGES.length] })));
    }
  }, [user, activeTab]);

  // Agar artist ne booking accept karli
  const handleAccept = async (req) => {
    try {
      await respondToBooking(req.id, { action: "accept", artist_name: user?.username, client_name: req.name || req.client_name, event_type: req.eventType || req.event_type });
    } catch (err) { console.error(err); }
  };

  // UI ko chalane ke liye zaroori variables return karo
  return { notifications, requests, stats, available, setAvailable, handleAccept, profile, profileLoading };
}
