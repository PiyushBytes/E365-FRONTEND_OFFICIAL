import React, { useState } from "react";
import { LayoutDashboard, Users, Calendar, Settings, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layout/DashboardLayout";
import ChatWidget from "../components/ChatWidget";
import AdminSettings from "../components/admin/AdminSettings";
import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import { useAdminData } from "../hooks/useAdminData";

const MENU_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'bookings', icon: Calendar, label: 'Bookings' },
  { id: 'artists', icon: Users, label: 'Artists' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState("");
  const adminData = useAdminData(searchQuery);

  return (
    <DashboardLayout menuItems={MENU_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} user={user} title="Admin Panel" onLogout={logout} searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {activeTab === 'dashboard' && <AdminOverviewTab {...adminData} />}
      {activeTab === 'settings' && <AdminSettings />}
      {!['dashboard', 'settings'].includes(activeTab) && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center"><Activity size={40} className="text-gray-600 mb-6" /><h3 className="text-2xl font-bold text-gray-500">Coming Soon</h3></div>
      )}
      <ChatWidget />
    </DashboardLayout>
  );
}
