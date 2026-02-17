import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  Settings,
  XCircle,
  User,
  CreditCard,
  ChevronRight
} from "lucide-react";
import SettingsModal from "../components/common/SettingsModal";

const DashboardLayout = ({
  children,
  menuItems,
  activeTab,
  onTabChange,
  user,
  title,
  notifications = [],
  onLogout,
  showSettings,
  setShowSettings,
  SettingsComponent,
  searchQuery,
  onSearchChange
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  // If onSearchChange is provided, use the prop value. Otherwise use internal state (though internal state is less useful if not exposed).
  // Better pattern: Lift state up.
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const isControlled = searchQuery !== undefined && onSearchChange !== undefined;
  
  const handleSearchChange = (e) => {
    if (isControlled) {
      onSearchChange(e.target.value);
    } else {
      setInternalSearchQuery(e.target.value);
    }
  };

  const effectiveSearchQuery = isControlled ? searchQuery : internalSearchQuery;

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden font-['Plus_Jakarta_Sans']">
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
        <div className="h-24 flex items-center justify-center border-b border-white/10">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? 'px-2' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
              <span className="font-['Syncopate'] font-bold text-white text-[10px]">E365</span>
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {title || "Dashboard"}
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
                onClick={() => onTabChange(item.id)}
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
        {isSidebarOpen && user && (
          <div className="p-4 mx-4 mb-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/20">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.role || 'Member'}</p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {setShowSettings && (
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <Settings size={20} />
              {isSidebarOpen && <span className="font-medium">Settings</span>}
            </button>
          )}
          <button
            onClick={onLogout}
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
              {menuItems.find((m) => m.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Search Bar (Optional) */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
              value={effectiveSearchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center gap-6">
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
                         <button className="text-xs text-blue-400 hover:text-blue-300">Clear all</button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                           <div className="p-4 text-center text-gray-500 text-xs">No new notifications</div>
                        ) : (
                          notifications.map((notif, idx) => (
                             <div key={idx} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col gap-1">
                                <h4 className="text-sm font-bold text-white">{notif.title || notif.event_type || "Notification"}</h4>
                                <p className="text-xs text-gray-400">{notif.message || notif.offer || "New update"}</p>
                             </div>
                          ))
                        )}
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/20 overflow-hidden cursor-pointer hover:border-red-500 transition-colors">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          {children}
        </main>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)}>
              {SettingsComponent ? (
                <SettingsComponent />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                        <User size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Profile Settings</h3>
                        <p className="text-xs text-gray-500">Manage account details</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                         <Bell size={18} />
                       </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Notifications</h3>
                        <p className="text-xs text-gray-500">Email & Push preferences</p>
                      </div>
                    </div>
                    <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer"><div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1" /></div>
                  </div>
                </div>
              )}
          </SettingsModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
