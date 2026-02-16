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
  User,
  MessageSquare,
  Star,
  MapPin,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWidget from "../components/ChatWidget";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  
  const [data, setData] = useState({
    profile: {},
    stats: {},
    activeBookings: [],
    recommendedArtists: [],
    messages: []
  });

  useEffect(() => {
    fetch("/static/client_dashboard_data.json")
      .then((res) => res.json())
      .then((fetchedData) => setData(fetchedData))
      .catch((err) => console.error("Error fetching client dashboard data:", err));
  }, []);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "bookings", icon: Calendar, label: "My Bookings" },
    { id: "messages", icon: MessageSquare, label: "Messages" },
    { id: "payments", icon: CreditCard, label: "Payments" },
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[150px]" />
      </div>

      {/* SIDEBAR */}
      <motion.aside
        initial={{ width: isSidebarOpen ? 260 : 80 }}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl z-20"
      >
        {/* Logo Area */}
        <div className="h-24 flex items-center justify-center border-b border-white/10">
           <div className={`flex items-center gap-3 ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
              <span className="font-['Syncopate'] font-bold text-white text-[10px]">E365</span>
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Client Hub
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

        {/* User Mini Profile (Bottom) */}
        {isSidebarOpen && (
           <div className="p-4 mx-4 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/20">
                 {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold truncate">{user?.username || 'Guest User'}</p>
                 <p className="text-xs text-gray-500 truncate">Premium Member</p>
              </div>
           </div>
        )}

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

          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96">
             <Search size={18} className="text-gray-400 mr-2" />
             <input 
                type="text" 
                placeholder="Search for artists, events..." 
                className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-black" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/20 overflow-hidden cursor-pointer hover:border-red-500 transition-colors">
               {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
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
                    <div
                      key={index}
                      className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md hover:translate-y-[-5px] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                         <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                         </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                      <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                    </div>
                  ))}
               </div>

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
                       <div key={booking.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
                          <div className="flex items-center gap-6 w-full md:w-auto">
                             <img src={booking.image} alt={booking.artistName} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                             <div>
                                <h4 className="text-xl font-bold text-white mb-1">{booking.artistName}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                   <span className="flex items-center gap-1"><Sparkles size={14} /> {booking.eventType}</span>
                                   <span className="flex items-center gap-1"><Calendar size={14} /> {booking.date}</span>
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                             <div className="text-right">
                                <span className="block text-xs text-gray-500 uppercase">Amount</span>
                                <span className="block text-lg font-bold text-white">{booking.amount}</span>
                             </div>
                             <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                                booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                             }`}>
                                {booking.status}
                             </div>
                          </div>
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
                       <div key={artist.id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300">
                          <div className="h-64 overflow-hidden relative">
                             <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold">{artist.rating}</span>
                             </div>
                          </div>
                          <div className="p-5">
                             <h4 className="text-lg font-bold text-white mb-1">{artist.name}</h4>
                             <p className="text-sm text-gray-400 mb-4">{artist.category}</p>
                             <div className="flex items-center justify-between">
                                <span className="text-red-500 font-bold">{artist.price}</span>
                                <button className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors">
                                   <ChevronRight size={18} />
                                </button>
                             </div>
                          </div>
                       </div>
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
                  <Settings size={40} className="text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-500">Coming Soon</h3>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
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
                 {/* Mock Settings */}
                 <div className="flex items-center justify-between">
                    <span className="text-gray-300">Dark Mode</span>
                    <div className="w-10 h-5 bg-green-600 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1" /></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-gray-300">Email Notifications</span>
                    <div className="w-10 h-5 bg-green-600 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1" /></div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-xs text-gray-600 font-mono">E365 dashboard v2.1.0</p>
                

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ChatWidget />


    </div>
  );
};

export default ClientDashboard;
