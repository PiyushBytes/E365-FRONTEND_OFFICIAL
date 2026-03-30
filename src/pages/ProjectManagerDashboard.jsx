import React, { useState, useRef, useEffect } from "react";
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
import PMChatModal from "../components/projectManager/PMChatModal";
import {
  getPMRequests,
  getPMRequestDetail,
  markNotificationRead,
  cancelPMRequest,
} from "../api/notifications";

const ProjectManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const chatRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getPMRequests();
      const chatboxList = res.data;

      const detailedRequests = await Promise.all(
        chatboxList.map(async (chatbox) => {
          try {
            const detail = await getPMRequestDetail(chatbox.id);
            const data = detail.data;

            let summary = null;
            try {
              const summaryRes = await import('../api/chatbot').then(m =>
                m.getChatboxSummary(chatbox.id)
              );
              summary = summaryRes?.data?.summary || null;
            } catch {
              summary = null;
            }

            return {
              id: chatbox.id,
              created_at: chatbox.created_at,
              status: chatbox.status,
              is_read: chatbox.event_manager_active,
              client_name: data.client?.username || "Unknown Client",
              company_name: summary?.company_name || "-",
              artist_name: summary?.artist_genre || "Pending",
              client_offerings: summary?.budget || "-",
              event_date: summary?.event_date || chatbox.created_at,
              event_place: summary?.event_location || "-",
              audience_size: summary?.audience_size || "-",
              event_description:
                summary?.additional_notes ||
                data.messages?.[data.messages.length - 1]?.content ||
                "No details yet",
            };
          } catch (err) {
            return {
              id: chatbox.id,
              created_at: chatbox.created_at,
              status: chatbox.status,
              is_read: chatbox.event_manager_active,
              client_name: "Unknown Client",
              company_name: "-",
              artist_name: "Pending",
              client_offerings: "-",
              event_date: chatbox.created_at,
              event_place: "-",
              audience_size: "-",
              event_description: "Click to view details",
            };
          }
        })
      );

      setNotifications(detailedRequests);
      const unread = detailedRequests.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch PM requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    }
  }, [activeTab]);

  const filteredNotifications = notifications.filter((n) => {
    if (!searchQuery) return true;
    return (
      n.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.artist_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const statsData = [
    {
      label: "Active Requests",
      value: notifications.length.toString(),
      trend: "Needs Action",
      icon: Bell,
      color: "text-purple-400",
    },
    {
      label: "Managed Artists",
      value: "45",
      trend: "+2",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Upcoming Events",
      value: "12",
      trend: "This Month",
      icon: Calendar,
      color: "text-green-400",
    },
  ];

  const handleLogout = () => logout();

  const handleOpenChat = async (notification) => {
    setSelectedChat(notification);

    if (!notification.is_read) {
      try {
        await markNotificationRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleCancel = async (notification) => {
    try {
      await cancelPMRequest(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      if (!notification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to cancel request:", err);
    }
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      id: "requests",
      icon: Bell,
      label: "Requests",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { id: "artists", icon: Users, label: "Artists" },
    { id: "settings", icon: Settings, label: "Settings" },
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
      {/* ===== DASHBOARD TAB ===== */}
      {activeTab === "dashboard" && (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell size={20} className="text-purple-500" />
                Recent Requests
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <button
                onClick={() => setActiveTab("requests")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                See All
              </button>
            </div>

            {loading ? (
              <div className="text-gray-400 text-center py-10">
                Loading requests...
              </div>
            ) : (
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
            )}
          </section>
        </div>
      )}

      {/* ===== REQUESTS TAB ===== */}
      {activeTab === "requests" && (
        <div className="max-w-7xl mx-auto animate-fade-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              All Requests
              {unreadCount > 0 && (
                <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h2>
            <button
              onClick={fetchRequests}
              className="text-sm text-gray-400 hover:text-white border border-slate-700 px-4 py-2 rounded-lg transition"
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-gray-400 text-center py-20">
              Loading requests...
            </div>
          ) : (
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
                  <p>No requests found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== SETTINGS TAB ===== */}
      {activeTab === "settings" && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <h3 className="text-2xl font-bold text-gray-500">Settings</h3>
          <p className="text-gray-600">
            Preferences and account settings go here.
          </p>
        </div>
      )}

      {/* ===== OTHER TABS ===== */}
      {activeTab !== "dashboard" &&
        activeTab !== "requests" &&
        activeTab !== "settings" && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Activity size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-500">Coming Soon</h3>
            <p className="text-gray-600">
              The {activeTab} module is currently being built.
            </p>
          </div>
        )}

      {/* ===== PM CHAT MODAL ===== */}
      {selectedChat && (
        <PMChatModal
          notification={selectedChat}
          onClose={() => setSelectedChat(null)}
        />
      )}

      <ChatWidget ref={chatRef} />
    </DashboardLayout>
  );
};

export default ProjectManagerDashboard;