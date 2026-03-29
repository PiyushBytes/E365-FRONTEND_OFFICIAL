import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Bell,
  Activity,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import StatsCard from "../components/common/StatsCard";
import ChatWidget from "../components/ChatWidget";
import PMNotification from "../components/projectManager/PMNotification";

const ProjectManagerDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState("");
    const chatRef = useRef(null);
  
    // Mock Data for Notifications
    const [notifications, setNotifications] = useState([
        { 
            id: 1, 
            artist_name: "The Weeknd", 
            client_name: "Tony Stark", 
            company_name: "Stark Industries", 
            client_offerings: 150000, 
            event_date: "2024-10-24T18:00:00Z", 
            event_place: "Malibu, CA", 
            audience_size: "500+", 
            event_description: "Private corporate event for Stark Industries executives." 
        },
        { 
            id: 2, 
            artist_name: "Dua Lipa", 
            client_name: "Bruce Wayne", 
            company_name: "Wayne Enterprises", 
            client_offerings: 120000, 
            event_date: "2024-11-02T20:00:00Z", 
            event_place: "Gotham City", 
            audience_size: "1000+", 
            event_description: "Annual Wayne Foundation charity gala." 
        },
        { 
            id: 3, 
            artist_name: "Martin Garrix", 
            client_name: "Lex Luthor", 
            company_name: "LexCorp", 
            client_offerings: 95000, 
            event_date: "2024-12-22T22:00:00Z", 
            event_place: "Metropolis", 
            audience_size: "2000+", 
            event_description: "End of year company party." 
        }
    ]);
  
    const filteredNotifications = notifications.filter(n => 
      n.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statsData = [
        { label: "Active Requests", value: notifications.length.toString(), trend: "Needs Action", icon: Bell, color: "text-purple-400" },
        { label: "Managed Artists", value: "45", trend: "+2", icon: Users, color: "text-blue-400" },
        { label: "Upcoming Events", value: "12", trend: "This Month", icon: Calendar, color: "text-green-400" },
    ];
  
    const handleLogout = () => {
      logout();
    };

    const handleOpenChat = (notification) => {
        console.log("Opening chat with:", notification.client_name);
        if (chatRef.current) {
            chatRef.current.open(`Hello ${notification.client_name}, I am the project manager for ${notification.artist_name}. Let's discuss your request!`);
        }
    };

    const handleCancel = (notification) => {
        console.log("Cancelling request for:", notification.id);
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
    };

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'requests', icon: Bell, label: 'Requests' },
        { id: 'artists', icon: Users, label: 'Artists' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];
  
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        title="Project Manager Panel"
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
          {activeTab === 'dashboard' ? (
              <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
              
              {/* 1. STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statsData.map((stat, index) => (
                      <StatsCard key={index} {...stat} />
                  ))}
              </div>
  
              {/* 2. RECENT REQUESTS PREVIEW */}
              <section>
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Bell size={20} className="text-purple-500" /> Recent Requests
                      </h3>
                      <button onClick={() => setActiveTab('requests')} className="text-sm text-gray-400 hover:text-white transition-colors">See All</button>
                  </div>
  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {filteredNotifications.slice(0, 2).map((req, index) => (
                      <PMNotification 
                          key={index} 
                          notification={req} 
                          onOpenChat={handleOpenChat} 
                          onCancel={handleCancel} 
                      />
                  ))}
                  {filteredNotifications.length === 0 && (
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
                      <h2 className="text-3xl font-bold">All Requests</h2>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((req, idx) => (
                      <PMNotification 
                          key={idx} 
                          notification={req} 
                          onOpenChat={handleOpenChat}
                          onCancel={handleCancel}
                      />
                      ))
                  ) : (
                      <div className="col-span-full py-20 text-center text-gray-500 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                          <Bell size={48} className="mx-auto mb-4 opacity-50" />
                          <p>No requests found matching your criteria.</p>
                      </div>
                  )}
                  </div>
              </div>
          ) : activeTab === 'settings' ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <h3 className="text-2xl font-bold text-gray-500">Settings</h3>
                  <p className="text-gray-600">Preferences and account settings go here.</p>
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Activity size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-500">Coming Soon</h3>
                  <p className="text-gray-600">The {activeTab} module is currently being built.</p>
              </div>
          )}
          <ChatWidget ref={chatRef} />
      </DashboardLayout>
    );
  };
  
  export default ProjectManagerDashboard;
