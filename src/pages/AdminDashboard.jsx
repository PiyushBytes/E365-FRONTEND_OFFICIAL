import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import StatsCard from "../components/common/StatsCard";
import LiveBookingsTable from "../components/admin/LiveBookingsTable";
import AdminQuickActions from "../components/admin/AdminQuickActions";
import AdminSettings from "../components/admin/AdminSettings";
import ChatWidget from "../components/ChatWidget";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState("");
  
    // Mock Data
    const bookings = [
      { client: "Stark Industries", artist: "The Weeknd", date: "Oct 24, 2023", status: "Confirmed", amount: "$150,000" },
      { client: "Wayne Ent.", artist: "Dua Lipa", date: "Nov 02, 2023", status: "Pending", amount: "$120,000" },
      { client: "Cyberdyne Sys", artist: "Skrillex", date: "Nov 15, 2023", status: "Cancelled", amount: "$85,000" },
      { client: "Umbrella Corp", artist: "Billie Eilish", date: "Dec 10, 2023", status: "Confirmed", amount: "$200,000" },
      { client: "Massive Dynamic", artist: "Martin Garrix", date: "Dec 22, 2023", status: "Pending", amount: "$95,000" },
    ];
  
    const filteredBookings = bookings.filter(b => 
      b.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statsData = [
        { label: "Total Revenue", value: "$2.4M", trend: "+12.5%", icon: CreditCard, color: "text-green-400" },
        { label: "Active Artists", value: "1,240", trend: "+5.2%", icon: Users, color: "text-blue-400" },
        { label: "Pending Bookings", value: "38", trend: "Action Req", icon: Calendar, color: "text-yellow-400" },
        { label: "Avg. Deal Size", value: "$45k", trend: "+2.1%", icon: TrendingUp, color: "text-purple-400" },
    ];
  
    const handleLogout = () => {
      logout();
    };

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'bookings', icon: Calendar, label: 'Bookings' },
        { id: 'artists', icon: Users, label: 'Artists' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];
  
    return (
      <DashboardLayout
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        title="Admin Panel"
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
          {activeTab === 'dashboard' ? (
              <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
              
              {/* 1. STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsData.map((stat, index) => (
                      <StatsCard key={index} {...stat} />
                  ))}
              </div>
  
              {/* 2. LIVE BOOKINGS SECTION */}
              <LiveBookingsTable bookings={filteredBookings} />
  
              {/* 3. ARTIST MANAGEMENT & QUICK ACTIONS */}
              <AdminQuickActions />
  
              </div>
          ) : activeTab === 'settings' ? (
              <AdminSettings />
          ) : (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Activity size={40} className="text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-500">Coming Soon</h3>
                  <p className="text-gray-600">The {activeTab} module is currently being built.</p>
              </div>
          )}
          <ChatWidget />
      </DashboardLayout>
    );
  };
  
  export default AdminDashboard;
