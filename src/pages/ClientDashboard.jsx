// Yeh client ka main dashboard page hai jahan wo apni bookings aur messages dekhta hai
import React, { useState } from "react";
import { LayoutDashboard, Calendar, CreditCard, MessageSquare } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import ChatWidget from "../components/ChatWidget";
import { useAuth } from "../context/AuthContext";
import { useClientData } from "../hooks/useClientData";
import ClientOverviewTab from "../components/client/ClientOverviewTab";
import MessagesTab from "../components/client/MessagesTab";

const MENU_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
  { id: "bookings", icon: Calendar, label: "My Bookings" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "payments", icon: CreditCard, label: "Payments" },
];

export default function ClientDashboard() {
  const { user, logout, isLoading } = useAuth(); // Auth details fetch karo
  const [activeTab, setActiveTab] = useState("dashboard"); // Track karega ki konsa tab khula hai
  const [showSettings, setShowSettings] = useState(false);
  const dataHooks = useClientData(activeTab); // Saara backend data yahan se aayega

  if (isLoading) return <div className="text-white p-10">Loading...</div>; // Data aane tak loader dikhao
  if (!user) return <div className="text-white p-10">User not found</div>; // Safety check

  return (
    <>
      {/* Isme saara sidebar aur header common structure set hota hai */}
      <DashboardLayout
        menuItems={MENU_ITEMS}
        activeTab={activeTab}
        // Jab koi naya tab click kare toh purani chats wagarah reset kar do
        onTabChange={(t) => { setActiveTab(t); dataHooks.setSelectedChatbox(null); dataHooks.setChatMessages([]); }}
        user={user}
        title="Client Hub"
        onLogout={logout}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      >
        {/* Jo tab select kiya hai sirf wahi component load karo */}
        {activeTab === "dashboard" && <ClientOverviewTab data={dataHooks.data} querySummary={dataHooks.querySummary} />}
        {activeTab === "messages" && <MessagesTab {...dataHooks} />}
        {["bookings", "payments"].includes(activeTab) && <div className="text-white">Coming Soon</div>}
      </DashboardLayout>

      <ChatWidget />
    </>
  );
}