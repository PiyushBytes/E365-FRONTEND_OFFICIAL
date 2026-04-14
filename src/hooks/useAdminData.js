// Yeh hook Admin dashboard ke statistics aur bookings ka data handle karta hai
import { useState } from "react";
import { CreditCard, Users, Calendar, TrendingUp } from "lucide-react";

// Fake data jo admin ko dikhana hai
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
  const [bookings] = useState(INITIAL_BOOKINGS);
  // Agar kisi ne search bar me kuch type kiya hai, toh client ya artist ke naam se filter karo
  const filteredBookings = bookings.filter(b => b.client.toLowerCase().includes((searchQuery || "").toLowerCase()) || b.artist.toLowerCase().includes((searchQuery || "").toLowerCase()));
  
  // Stats aur filter ki hui list return karo UI ke liye
  return { statsData: STATS_DATA, filteredBookings };
}
