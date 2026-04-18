import React, { useState, useRef, useEffect } from "react";
import { LayoutDashboard, Calendar, CreditCard, Ticket } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import ChatWidget from "../components/ChatWidget";
import { useAuth } from "../context/AuthContext";
import { useArtistData } from "../hooks/useArtistData";
import { useNotifications } from "../context/NotificationContext";
import ArtistOverviewTab from "../components/artist/ArtistOverviewTab";
import RequestsTab from "../components/artist/RequestsTab";

const MENU_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "requests", icon: Ticket, label: "Requests" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "payments", icon: CreditCard, label: "Payments" },
];

export default function ArtistDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const dataHooks = useArtistData(user, activeTab);
  const { notifications: systemNotifications, fetchNotifications } = useNotifications();
  const chatRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNegotiate = (notif) => chatRef.current?.open(`Hi, I'd like to negotiate the request for ${notif.event_name}`);
  const handleAccept = (notif) => alert(`You have accepted the request for ${notif.event_name}`);

  return (
    <DashboardLayout menuItems={MENU_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} user={user} title="Artist Panel" notifications={systemNotifications} onLogout={logout} showSettings={showSettings} setShowSettings={setShowSettings}>
      {activeTab === "dashboard" && <ArtistOverviewTab user={user} {...dataHooks} />}
      {activeTab === "requests" && <RequestsTab notifications={dataHooks.notifications} handleNegotiate={handleNegotiate} handleAccept={handleAccept} />}
      {["calendar", "payments"].includes(activeTab) && <div className="text-slate-500 text-center mt-20 font-medium">Coming Soon...</div>}
      <ChatWidget ref={chatRef} />
    </DashboardLayout>
  );
}
