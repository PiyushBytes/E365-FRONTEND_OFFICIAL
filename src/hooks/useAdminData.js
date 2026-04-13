// Yeh hook Admin dashboard ke statistics aur bookings ka data handle karta hai
import { useState, useEffect } from "react";
import { CreditCard, Users, Calendar, TrendingUp } from "lucide-react";
import api from "../api/axios";

// Fallback data jo tab aayega jab backend endopint fully ready nahi hoga
const INITIAL_BOOKINGS = [
  { client: "Stark Industries", artist: "The Weeknd", date: "Oct 24, 2023", status: "Confirmed", amount: "$150,000" },
  { client: "Wayne Ent.", artist: "Dua Lipa", date: "Nov 02, 2023", status: "Pending", amount: "$120,000" },
  { client: "Cyberdyne Sys", artist: "Skrillex", date: "Nov 15, 2023", status: "Cancelled", amount: "$85,000" },
  { client: "Umbrella Corp", artist: "Billie Eilish", date: "Dec 10, 2023", status: "Confirmed", amount: "$200,000" },
  { client: "Massive Dynamic", artist: "Martin Garrix", date: "Dec 22, 2023", status: "Pending", amount: "$95,000" },
];

const STATS_DATA = [
  { label: "Total Revenue", value: "$2.4M", trend: "+12.5%", icon: CreditCard, color: "text-green-400" },
  { label: "Active Artists", value: "1,240", trend: "+5.2%", icon: Users, color: "text-blue-400" },
  { label: "Pending Bookings", value: "38", trend: "Action Req", icon: Calendar, color: "text-yellow-400" },
  { label: "Avg. Deal Size", value: "$45k", trend: "+2.1%", icon: TrendingUp, color: "text-purple-400" },
];

export function useAdminData(searchQuery) {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(STATS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/dashboard/");
        if (res.data?.bookings) {
          setBookings(res.data.bookings);
        } else {
          setBookings(INITIAL_BOOKINGS);
        }
        if (res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.warn("Failed to fetch admin data, using fallback.", err);
        setBookings(INITIAL_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBookings = bookings.filter(b => b.client?.toLowerCase().includes((searchQuery || "").toLowerCase()) || b.artist?.toLowerCase().includes((searchQuery || "").toLowerCase()));
  
  return { statsData: stats, filteredBookings, loading };
}
