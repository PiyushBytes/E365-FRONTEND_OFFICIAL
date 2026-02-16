import React, { useState, useEffect } from "react";
import AdminSettings from "../components/AdminSettings";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Menu,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Music2,
  Mic2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Simulated fetching for demonstration (replace with actual fetch if needed)
  useEffect(() => {
    fetch("/static/admin_dashboard_data.json")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching admin dashboard data:", err));
  }, []);

  // Filter bookings based on search
  const filteredBookings = bookings.filter(
    (b) =>
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* BACKGROUND ACCENTS */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px]" />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-3 ${isSidebarOpen ? 'px-2' : 'justify-center'}`}
          >
            {/* Logo Image with Frame */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative w-10 h-10 rounded-full p-[2px] bg-black">
                <img 
                  src="https://ugc.production.linktr.ee/fe33f3be-cd52-4169-ad3b-8f13f633d46d_463381274-10161519171976068-6833862525996137253-n.jpeg?io=true&size=avatar-v3_0" 
                  alt="E365 Logo" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                E365 Group
              </span>
            )}
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: "Dashboard" },
            { id: 'bookings', icon: CalendarDays, label: "Bookings" },
            { id: 'artists', icon: Users, label: "Artists" },
            { id: 'finance', icon: DollarSign, label: "Finance" },
            { id: 'settings', icon: Settings, label: "Settings" },
          ].map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={idx}
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
              </button>
            );
          })}
        </nav>

        {/* User Profile Snippet */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/20 overflow-hidden">
               {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.username || 'Admin User'}</p>
                {/* <p className="text-xs text-gray-500 truncate">[kinjal@gmail.com]</p> */}
              </div>
            )}
          </div>
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
              {/* Mobile Menu Trigger Placeholder */}
              <Menu size={20} className="text-gray-400" />
            </div>

            <h1 className="text-xl font-bold hidden sm:block">Dashboard Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 w-64 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-black" />
            </button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          {activeTab === 'dashboard' ? (
            <div className="max-w-7xl mx-auto space-y-10">
              {/* 1. STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Revenue", value: "₹12.5L", trend: "+12%", icon: DollarSign, color: "text-green-400" },
                  { label: "Active Bookings", value: "63", trend: "+5", icon: CalendarDays, color: "text-blue-400" },
                  { label: "Total Artists", value: "42", trend: "+2", icon: Mic2, color: "text-purple-400" },
                  { label: "New Clients", value: "128", trend: "+8%", icon: Users, color: "text-orange-400" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-white/20 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <stat.icon size={60} />
                    </div>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                        <TrendingUp size={12} />
                        {stat.trend}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                      <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 2. LIVE BOOKINGS SECTION */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Live Booking Activity</h2>
                    <p className="text-sm text-gray-400">Real-time status updates</p>
                  </div>
                  <button className="text-sm text-red-500 hover:text-red-400 transition-colors font-medium">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/20 text-gray-200 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Client</th>
                        <th className="px-6 py-4 font-semibold">Artist</th>
                        <th className="px-6 py-4 font-semibold">Event</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Amount</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking, i) => (
                          <tr
                            key={i}
                            className="hover:bg-white/5 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                {booking.clientImage ? (
                                  <img src={booking.clientImage} alt={booking.clientName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">
                                    {booking.clientName.charAt(0)}
                                  </div>
                                )}
                              </div>
                              {booking.clientName}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                  {booking.artistImage ? (
                                    <img src={booking.artistImage} alt={booking.artistName} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs">
                                      {booking.artistName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                {booking.artistName}
                              </div>
                            </td>
                            <td className="px-6 py-4">{booking.eventType}</td>
                            <td className="px-6 py-4">{booking.date}</td>
                            <td className="px-6 py-4 font-medium text-white">
                              {booking.signingAmount}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                  booking.status === "Accepted"
                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                    : booking.status === "Pending"
                                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                                }`}
                              >
                                {booking.status === "Accepted" && <CheckCircle2 size={12} />}
                                {booking.status === "Pending" && <Clock size={12} />}
                                {booking.status === "Rejected" && <XCircle size={12} />}
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            No bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* 3. ARTIST MANAGEMENT & QUICK ACTIONS (Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Artist List */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Top Artists</h3>
                    <button className="text-sm text-red-500 hover:text-red-400">View All</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: "Arijit Singh", role: "Singer", status: "Active", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&h=150&fit=crop" },
                      { name: "DJ Nova", role: "DJ", status: "Offline", img: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=150&h=150&fit=crop" },
                      { name: "Zakir Khan", role: "Comedian", status: "Active", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&h=150&fit=crop" },
                    ].map((artist, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-2xl bg-black/20 hover:bg-white/5 transition-colors border border-white/5 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-white/10">
                            <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                              {artist.name}
                            </h4>
                            <p className="text-xs text-gray-400">{artist.role}</p>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${artist.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions / Mini Stats */}
                <div className="space-y-6">
                   <div className="bg-gradient-to-br from-red-600 to-red-900 rounded-3xl p-6 shadow-xl relative overflow-hidden ring-1 ring-white/10">
                      <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                          <p className="text-red-100/80 text-sm mb-6">Unlock advanced analytics and reports.</p>
                          <button className="bg-white text-red-600 py-2 px-6 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                              Upgrade Now
                          </button>
                      </div>
                      {/* Decorative Circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5" />
                   </div>

                   <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                       <h3 className="text-lg font-bold mb-4">System Health</h3>
                       <div className="space-y-4">
                          <div>
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Server Load</span>
                                  <span>24%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500 w-[24%]" />
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                  <span>Database Storage</span>
                                  <span>68%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-500 w-[68%]" />
                              </div>
                          </div>
                       </div>
                   </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            <AdminSettings />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Content for {activeTab} coming soon...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
