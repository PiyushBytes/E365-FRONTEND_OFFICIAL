import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  CheckCircle2,
  XCircle,
  Clock,
  Mic2,
  ListMusic,
  User,
  MoreVertical,
  ChevronRight,
  Ticket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import ArtistNotification from "../components/ArtistNotification";
import { sendMessage } from "../api/chatbot";

const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [available, setAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    acceptedBookings: 0,
    revenue: "₹0K",
  });
  const [requests, setRequests] = useState([]);

  // Mock data for client photos
  const clientImages = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  ];

  useEffect(() => {
    // Fetch notifications using the new endpoint
    const fetchNotifications = async () => {
      try {
        // Headers are automatically handled by axios interceptor in api/axios.js
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

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-500px h-500px bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-600px h-600px bg-red-900/10 rounded-full blur-[150px]" />
      </div>

      {/* SIDEBAR */}
      <motion.aside
        initial={{ width: isSidebarOpen ? 260 : 80 }}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl z-20"
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-white/10">
           <div className={`flex items-center gap-3 ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
              <span className="font-['Syncopate'] font-bold text-white text-[10px]">E365</span>
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Artist Panel
              </span>
            )}
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={isActive ? "text-white" : "text-gray-400 group-hover:text-white"}
                />
                {isSidebarOpen && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
                {isActive && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings size={20} />
            {isSidebarOpen && <span className="font-medium">Settings</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOPBAR */}
        <header className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors md:block hidden"
            >
              <Menu size={20} />
            </button>
            <div className="block md:hidden">
              <Menu size={20} className="text-gray-400" />
            </div>

            <h1 className="text-xl font-bold hidden sm:block">
              {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
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

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-black" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
                   >
                      <div className="p-3 border-b border-white/10 flex justify-between items-center">
                         <h3 className="font-bold text-sm text-white">Notifications</h3>
                         <button onClick={() => setNotifications([])} className="text-xs text-blue-400 hover:text-blue-300">Clear all</button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                           <div className="p-4 text-center text-gray-500 text-xs">No new notifications</div>
                        ) : (
                          notifications.map((notif, idx) => (
                             <div key={idx} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col gap-1">
                                <h4 className="text-sm font-bold text-white">{notif.event_type || "Event Request"}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                  <span>Offer: {notif.client_offerings}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                                  <span>{notif.event_place}</span>
                                  <span>•</span>
                                  <span>{notif.audience_size} ppl</span>
                                </div>
                             </div>
                          ))
                        )}
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Pic */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/20 overflow-hidden cursor-pointer hover:border-red-500 transition-colors">
               {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
           {activeTab === 'dashboard' ? (
             <div className="max-w-7xl mx-auto space-y-8 animate-fade-up">
               
               {/* Welcome Banner */}
               <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.username || 'Artist'}</h2>
                    <p className="text-gray-400 text-sm">Here's what's happening internally today.</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-sm text-gray-500">Last updated: Just now</span>
                  </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Bookings", value: stats.totalBookings, trend: "+12%", icon: ListMusic, color: "text-blue-400" },
                    { label: "Pending Requests", value: stats.pendingRequests, trend: "Action Req", icon: Clock, color: "text-yellow-400" },
                    { label: "Confirmed", value: stats.acceptedBookings, trend: "This Month", icon: CheckCircle2, color: "text-green-400" },
                    { label: "Revenue", value: stats.revenue, trend: "+8.5%", icon: CreditCard, color: "text-purple-400" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md hover:border-white/20 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <stat.icon size={60} />
                      </div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-white/5 text-white">
                           <stat.icon size={20} className={stat.color} />
                        </div>
                        {stat.trend === "Action Req" ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full animate-pulse">
                            {stat.trend}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            {stat.trend}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                        <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                      </div>
                    </div>
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
                     <div key={index} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-0 overflow-hidden hover:border-red-500/30 transition-all group">
                        <div className="flex flex-col sm:flex-row">
                           {/* Date Stub */}
                           <div className="sm:w-24 bg-red-900/10 border-b sm:border-b-0 sm:border-r border-white/5 flex flex-col items-center justify-center p-4">
                              <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">{req.date.split(" ")[0]}</span>
                              <span className="text-2xl font-bold text-white">{req.date.split(" ")[1]}</span>
                           </div>
                           
                           {/* Content */}
                           <div className="flex-1 p-5">
                              <div className="flex items-start justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                    <img src={req.clientImg} alt="Client" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                    <div>
                                       <h4 className="font-bold text-white text-base">{req.name}</h4>
                                       <p className="text-xs text-gray-400">{req.location} • {req.eventType}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className="block text-xs text-gray-500 uppercase mb-1">Offer</span>
                                    <span className="block text-lg font-bold text-green-400">{req.offer}</span>
                                 </div>
                              </div>

                              <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                                 <button 
                                 onClick={() => handleAccept(req)}
                                 className="flex-1 bg-white text-black hover:bg-red-600 hover:text-white py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                                    Accept
                                 </button>
                                 <button className="px-4 py-2 border border-white/10 hover:border-red-500/50 hover:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-gray-400">
                                    Decline
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
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
                      <ArtistNotification key={idx} notification={req} />
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
                <Settings size={32} className="text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-500">Coming Soon</h3>
              <p className="text-gray-600">The {activeTab} module is currently being built.</p>
           </div>
           )}
        </main>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <XCircle size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Public Visibility</h3>
                      <p className="text-xs text-gray-500">Allow promoters to find you</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1" /></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                       <Bell size={18} />
                     </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Email Notifications</h3>
                      <p className="text-xs text-gray-500">Get updates on new gigs</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1" /></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                       <CreditCard size={18} />
                     </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Payout Methods</h3>
                      <p className="text-xs text-gray-500">Manage bank accounts</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-gray-600 font-mono">E365 dashboard v2.1.0</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtistDashboard;
