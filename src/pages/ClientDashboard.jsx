import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  MessageSquare,
  Star,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import StatsCard from "../components/common/StatsCard";
import RecommendedArtistCard from "../components/client/RecommendedArtistCard";
import ActiveBookingCard from "../components/client/ActiveBookingCard";
import ChatWidget from "../components/ChatWidget";

import { getChatboxSummary, getAllChatboxes, getChatMessages } from "../api/chatbot";
import { processPayment } from "../api/booking";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [data, setData] = useState({
    profile: {},
    stats: {},
    activeBookings: [],
    recommendedArtists: [],
    messages: [],
  });

  const [querySummary, setQuerySummary] = useState(null);

  // ✅ Messages tab ke liye new states
  const [chatboxes, setChatboxes] = useState([]);
  const [selectedChatbox, setSelectedChatbox] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // ✅ Initial data fetch
  useEffect(() => {
    fetch("/static/client_dashboard_data.json")
      .then((res) => res.json())
      .then((fetchedData) => setData(fetchedData))
      .catch((err) => console.error("Error fetching client dashboard data:", err));

    const chatboxId = localStorage.getItem("chatboxId");
    if (chatboxId) {
      getChatboxSummary(chatboxId)
        .then((res) => setQuerySummary(res.data))
        .catch((err) => console.error("Error fetching query summary:", err));
    }
  }, []);

  // ✅ Jab Messages tab open ho → saare chatboxes load karo
  useEffect(() => {
    if (activeTab === "messages") {
      getAllChatboxes()
        .then((res) => setChatboxes(res.data))
        .catch((err) => console.error("Error fetching chatboxes:", err));
    }
  }, [activeTab]);

  // ✅ Jab koi chatbox select ho → uski messages load karo
  const handleSelectChatbox = async (chatbox) => {
    setSelectedChatbox(chatbox);
    setLoadingMessages(true);
    try {
      const res = await getChatMessages(chatbox.id);
      const formatted = res.data.map((msg) => ({
        role: msg.sender === "user" ? "user" : "bot",
        text: msg.content,
        time: msg.created_at,
      }));
      setChatMessages(formatted);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  if (isLoading) return <div className="text-white p-10">Loading...</div>;
  if (!user) return <div className="text-white p-10">User not found</div>;

  const handleLogout = () => logout();

  const handlePayment = async (bookingId) => {
    try {
      const response = await processPayment(bookingId, { amount: 10000 });
      console.log("Payment initialized:", response.data);
      alert("Payment successful!");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to process payment");
    }
  };

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "bookings", icon: Calendar, label: "My Bookings" },
    { id: "messages", icon: MessageSquare, label: "Messages" },
    { id: "payments", icon: CreditCard, label: "Payments" },
  ];

  // ================= MESSAGES TAB UI =================
  const renderMessagesTab = () => {
    // Ek chatbox selected hai → uski messages dikhao
    if (selectedChatbox) {
      return (
        <div className="max-w-3xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => { setSelectedChatbox(null); setChatMessages([]); }}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ChevronLeft size={18} /> Back to all chats
          </button>

          {/* Chat Header */}
          <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700">
            <h3 className="text-white font-bold text-lg">
              Chat #{selectedChatbox.id}
            </h3>
            <p className="text-gray-400 text-sm">
              {new Date(selectedChatbox.created_at).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-3">
            {loadingMessages ? (
              <div className="text-gray-400 text-center py-10">Loading messages...</div>
            ) : chatMessages.length === 0 ? (
              <div className="text-gray-400 text-center py-10">No messages found</div>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[75%] text-white text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 self-end ml-auto"
                      : "bg-slate-700 self-start"
                  }`}
                >
                  {msg.text}
                  {msg.time && (
                    <div className="text-xs text-gray-300 mt-1 text-right">
                      {new Date(msg.time).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    // Chatbox list dikhao
    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Conversations</h2>

        {chatboxes.length === 0 ? (
          <div className="text-gray-400 text-center py-20">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
            <p>No conversations yet.</p>
            <p className="text-sm mt-1">Start a chat using the 💬 button!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chatboxes.map((chatbox) => (
              <button
                key={chatbox.id}
                onClick={() => handleSelectChatbox(chatbox)}
                className="bg-slate-800 hover:bg-slate-700 transition border border-slate-700 rounded-xl p-5 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold">
                      Chat #{chatbox.id}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {chatbox.last_message || "Click to view conversation"}
                    </p>
                  </div>
                  <div className="text-gray-500 text-xs text-right">
                    {chatbox.created_at
                      ? new Date(chatbox.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short"
                        })
                      : ""}
                    <div className="mt-2">
                      {chatbox.request_submitted && (
                        <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">
                          ✅ Request Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setSelectedChatbox(null); // tab change pe selected chat reset
        setChatMessages([]);
      }}
      user={user}
      title="Client Hub"
      onLogout={handleLogout}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* ===== DASHBOARD TAB ===== */}
      {activeTab === "dashboard" && (
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Banner */}
          <div className="relative rounded-3xl overflow-hidden p-8 border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
              alt="Concert"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Plan Your Next <span className="text-red-500">Event</span>
              </h2>
              <p className="text-gray-300">Connect with top artists easily.</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: "Total Spent", value: data.stats?.totalSpent, icon: CreditCard },
              { label: "Active Bookings", value: data.stats?.activeBookings, icon: Calendar },
              { label: "Completed Events", value: data.stats?.completedEvents, icon: CheckCircle2 },
              { label: "Saved Artists", value: data.stats?.savedArtists, icon: Star },
            ].map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Query Summary */}
          {querySummary?.summary && (
            <div className="bg-blue-600/20 p-6 rounded-xl">
              <h3 className="text-blue-400 font-bold mb-3">Query Summary</h3>
              <p>📅 Date: {querySummary.summary.event_date}</p>
              <p>📍 Location: {querySummary.summary.event_location}</p>
              <p>🎉 Type: {querySummary.summary.event_type}</p>
              <p>💰 Budget: {querySummary.summary.budget}</p>
              <p>⏱ Duration: {querySummary.summary.duration_hours}</p>
              <p>🎤 Genre: {querySummary.summary.artist_genre}</p>
              <p>📝 Notes: {querySummary.summary.additional_notes}</p>
            </div>
          )}

          {/* Bookings */}
          <section>
            <h3 className="text-xl font-bold mb-4">Active Bookings</h3>
            {data?.activeBookings?.map((booking) => (
              <div key={booking.id}>
                <ActiveBookingCard booking={booking} />
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ===== MESSAGES TAB ===== */}
      {activeTab === "messages" && renderMessagesTab()}

      {/* ===== OTHER TABS ===== */}
      {activeTab === "bookings" && <div className="text-white">Coming Soon</div>}
      {activeTab === "payments" && <div className="text-white">Coming Soon</div>}

      <ChatWidget />
    </DashboardLayout>
  );
};

export default ClientDashboard;