import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, Settings, Bell, Activity } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import ChatWidget from "../components/ChatWidget";
import PMChatModal from "../components/projectManager/PMChatModal";
import { useProjectManagerData } from "../hooks/useProjectManagerData";
import PMOverviewTab from "../components/projectManager/PMOverviewTab";
import PMRequestsTab from "../components/projectManager/PMRequestsTab";

export default function ProjectManagerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const pmData = useProjectManagerData(activeTab, searchQuery);
  const chatRef = useRef(null);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "requests", icon: Bell, label: "Requests", badge: pmData.unreadCount > 0 ? pmData.unreadCount : null },
    { id: "artists", icon: Users, label: "Artists" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <DashboardLayout menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} user={user} title="Project Manager Panel" onLogout={logout} searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {activeTab === "dashboard" && <PMOverviewTab {...pmData} setActiveTab={setActiveTab} />}
      {activeTab === "requests" && <PMRequestsTab {...pmData} />}
      {activeTab === "settings" && <div className="flex flex-col items-center justify-center h-[50vh] text-center"><h3 className="text-2xl font-bold text-gray-500">Settings</h3></div>}
      {!["dashboard", "requests", "settings"].includes(activeTab) && <div className="flex flex-col items-center justify-center h-[50vh] text-center"><Activity size={40} className="text-gray-600 mb-6" /><h3 className="text-2xl font-bold text-gray-500">Coming Soon</h3></div>}
      {pmData.selectedChat && <PMChatModal notification={pmData.selectedChat} onClose={() => pmData.setSelectedChat(null)} onJoinChat={() => { if (!pmData.selectedChat.is_read) pmData.markChatAsRead(pmData.selectedChat.id); }} />}
      <ChatWidget ref={chatRef} />
    </DashboardLayout>
  );
}