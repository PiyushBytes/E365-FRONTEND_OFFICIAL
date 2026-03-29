import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  MessageSquare,
  Star,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import StatsCard from "../components/common/StatsCard";
import RecommendedArtistCard from "../components/client/RecommendedArtistCard";
import ChatWidget from "../components/ChatWidget";
import { getChatboxSummary } from "../api/chatbot";
import { processPayment } from "../api/booking";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [data, setData] = useState({
    profile: {},
    stats: {},
    activeBookings: [],
    recommendedArtists: [],
    messages: []
  });

  const [querySummary, setQuerySummary] = useState(null);

  useEffect(() => {
    fetch("/static/client_dashboard_data.json")
      .then((res) => res.json())
      .then((fetchedData) => setData(fetchedData))
      .catch((err) => console.error("Error fetching client dashboard data:", err));

    const chatboxId = localStorage.getItem('chatboxId');
    if (chatboxId) {
      getChatboxSummary(chatboxId)
        .then(res => setQuerySummary(res.data))
        .catch(err => console.error("Error fetching query summary:", err));
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handlePayment = async (bookingId) => {
    try {
      const response = await processPayment(bookingId, { amount: 10000 }); // Mock amount, adapt as needed
      console.log("Payment initialized:", response.data);
      alert("Payment successful / initiated!");
    } catch(err) {
      console.error("Payment error:", err);
      alert("Failed to process payment");
    }
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "bookings", icon: Calendar, label: "My Bookings" },
    { id: "messages", icon: MessageSquare, label: "Messages" },
    { id: "payments", icon: CreditCard, label: "Payments" },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      title="Client Hub"
      onLogout={handleLogout}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
        {activeTab === 'dashboard' ? (
            <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
            
            {/* Welcome Banner */}
            <div className="relative rounded-3xl overflow-hidden p-8 lg:p-12 border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-black z-10" />
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop" alt="Concert" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                
                <div className="relative z-20 max-w-2xl">
                    <h2 className="text-4xl lg:text-5xl font-black font-['Syncopate'] mb-4 uppercase leading-tight">
                    Plan Your Next <span className="text-red-500">Big Event</span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                    Connect with top-tier artists and make your event unforgettable. Browse 100+ new exclusive listings today.
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/50">
                    Explore Artists
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                { label: "Total Spent", value: data.stats?.totalSpent, icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10" },
                { label: "Active Bookings", value: data.stats?.activeBookings, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Completed Events", value: data.stats?.completedEvents, icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-500/10" },
                { label: "Saved Artists", value: data.stats?.savedArtists, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                ].map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Query Summary Notification */}
            {querySummary && (
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-blue-400 mb-2">Current Query Status</h3>
                    <p className="text-gray-300">
                        {querySummary.summary || "Your request is currently being processed by the agent. Check back for updates!"}
                    </p>
                </div>
            )}

            {/* Active Bookings Preview */}
            <section>
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Active Bookings
                </h3>
                <button className="text-sm text-red-500 hover:text-red-400 transition-colors font-bold uppercase tracking-wide">View All</button>
                </div>
                
                <div className="space-y-4">
                {data.activeBookings?.map((booking) => (
                    <div key={booking.id} className="relative">
                        <ActiveBookingCard booking={booking} />
                        {booking.status === 'Accepted' && (
                           <button onClick={() => handlePayment(booking.id)} className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase">
                             Pay Now
                           </button>
                        )}
                    </div>
                ))}
                </div>
            </section>

            {/* Recommended Artists */}
            <section>
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recommended For You</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.recommendedArtists?.map((artist) => (
                    <RecommendedArtistCard key={artist.id} artist={artist} />
                ))}
                </div>
            </section>

            </div>
        ) : activeTab === 'bookings' ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-up">
            <Calendar size={64} className="text-gray-800 mb-6" />
            <h3 className="text-2xl font-bold text-gray-500">My Bookings</h3>
            <p className="text-gray-600 max-w-md mx-auto mt-2">View details of your past and upcoming events, manage contracts, and track payments.</p>
            </div>
        ) : activeTab === 'messages' ? (
            <div className="max-w-4xl mx-auto animate-fade-up">
            <h3 className="text-2xl font-bold text-white mb-6">Messages</h3>
            <div className="space-y-2">
                {data.messages?.map((msg) => (
                    <div key={msg.id} className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-zinc-900/60 cursor-pointer transition-colors">
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 font-bold">
                            {msg.sender[0]}
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{msg.sender}</h4>
                            <p className="text-xs text-gray-400">{msg.subject}</p>
                        </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-500 block mb-1">{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <CreditCard size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-500">Coming Soon</h3>
            <p className="text-gray-600">The {activeTab} module is currently being built.</p>
            </div>
        )}
      <ChatWidget />
    </DashboardLayout>
  );
};

export default ClientDashboard;
