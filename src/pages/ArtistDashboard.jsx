import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Ticket,
  Clock,
  CheckCircle2,
  ListMusic,
} from "lucide-react";
import api from "../api/axios";
import { sendMessage } from "../api/chatbot";
import DashboardLayout from "../layout/DashboardLayout";
import StatsCard from "../components/common/StatsCard";
import ArtistNotification from "../components/artist/ArtistNotification";
import RequestCard from "../components/artist/RequestCard";
import ChatWidget from "../components/ChatWidget";

const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [available, setAvailable] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    acceptedBookings: 0,
    revenue: "₹0K",
  });
  const [requests, setRequests] = useState([]);
  
  const chatRef = React.useRef(null);
  
  const handleNegotiate = (notification) => {
    console.log("Negotiating for:", notification);
    if (chatRef.current) {
        chatRef.current.open(`I would like to negotiate for the event: ${notification.event_name || 'Event'}`);
    }
  };
  const clientImages = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await api.get("/artist/notify-artist/", {
                params: { username: user?.username } 
            });
            console.log("Fetched notifications:", response.data);
            
            if (response.data && Array.isArray(response.data.notifications)) {
                setNotifications(response.data.notifications);
            } else if (Array.isArray(response.data)) {
                setNotifications(response.data);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    if (user) {
        fetchNotifications();
    }

    fetch("/static/artist_dashboard_count.json")
    .then((res) => {
        if (!res.ok) throw new Error("JSON load failed");
        return res.json();
    })
    .then((data) => {
        setStats({
        totalBookings: data?.totalBookings ?? 0,
        pendingRequests: data?.pendingRequests ?? 0,
        acceptedBookings: data?.acceptedBookings ?? 0,
        revenue: data?.revenue ?? "₹0K",
        });

        const enrichedRequests = (data.requests || []).map((req, i) => ({
        ...req,
        clientImg: clientImages[i % clientImages.length]
        }));
        setRequests(enrichedRequests);
    })
    .catch((err) => console.error("Error fetching dashboard data:", err));
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleAccept = async (req) => {
  try {
    const response = await sendMessage({
      role: "artist",
      message: "Booking accepted",
      artist_name: user?.username,
      client_name: req.name,
      event_type: req.eventType,
      offer: req.offer
    });

    console.log("Bot response:", response.data);

  } catch (error) {
    console.error("Error sending bot message:", error);
  }
};


  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "requests", icon: Ticket, label: "Requests" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "payments", icon: CreditCard, label: "Payments" },
  ];

  const statsData = [
    { label: "Total Bookings", value: stats.totalBookings, trend: "+12%", icon: ListMusic, color: "text-blue-400" },
    { label: "Pending Requests", value: stats.pendingRequests, trend: "Action Req", icon: Clock, color: "text-yellow-400" },
    { label: "Confirmed", value: stats.acceptedBookings, trend: "This Month", icon: CheckCircle2, color: "text-green-400" },
    { label: "Revenue", value: stats.revenue, trend: "+8.5%", icon: CreditCard, color: "text-purple-400" },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      title="Artist Panel"
      notifications={notifications}
      onLogout={handleLogout}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
    >
        {activeTab === 'dashboard' ? (
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
            
            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.username || 'Artist'}</h2>
                    <p className="text-gray-400 text-sm">Here's what's happening internally today.</p>
                </div>
                <div className="flex items-center gap-3">
                     {/* Availability Toggle */}
                    <div 
                    onClick={() => setAvailable(!available)}
                    className={`cursor-pointer hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                        available ? 'border-green-500/30 bg-green-500/5' : 'border-gray-700 bg-gray-800/20'
                    }`}
                    >
                    <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${available ? 'text-green-400' : 'text-gray-500'}`}>
                        {available ? "Online" : "Offline"}
                    </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Requests Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Ticket size={20} className="text-red-500" /> New Requests
                    </h3>
                    <button className="text-sm text-gray-400 hover:text-white transition-colors">See All</button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {requests.map((req, index) => (
                    <RequestCard 
                        key={index} 
                        req={req} 
                        onAccept={handleAccept} 
                        onDecline={() => {}} 
                    />
                ))}
                {requests.length === 0 && (
                    <div className="col-span-full p-8 text-center text-gray-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                        No pending requests at the moment.
                    </div>
                )}
                </div>
            </section>

            </div>
        ) : activeTab === 'requests' ? (
            <div className="max-w-7xl mx-auto animate-fade-up">
                <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Request History</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Pending</button>
                    <button className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Accepted</button>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notifications.length > 0 ? (
                    notifications.map((req, idx) => (
                    <ArtistNotification 
                        key={idx} 
                        notification={req} 
                        onNegotiate={handleNegotiate}
                    />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                        <Ticket size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No requests found matching your criteria.</p>
                    </div>
                )}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Ticket size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-500">Coming Soon</h3>
            <p className="text-gray-600">The {activeTab} module is currently being built.</p>
        </div>
        )}
      <ChatWidget ref={chatRef} />
    </DashboardLayout>
  );
};

export default ArtistDashboard;
