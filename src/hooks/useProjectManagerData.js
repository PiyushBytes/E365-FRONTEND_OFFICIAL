// Yeh dashboard event manager (PM) ko handle karta hai
import { useState, useEffect } from "react";
import { getPMRequests, getPMRequestDetail, markNotificationRead, cancelPMRequest } from "../api/notifications";
import { getChatboxSummary } from "../api/chatbot";

export function useProjectManagerData(activeTab, searchQuery) {
  // Inbox aur requests ka global data aayega isme
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null); // PMChatModal view karni hai ya nahi

  // Function: API call mar ke saare incoming event requests uthao
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getPMRequests();
      
      // Har request ki detailed information ek saath mangwao
      const detailedRequests = await Promise.all(
        res.data.map(async (chatbox) => {
          try {
            const detail = await getPMRequestDetail(chatbox.id);
            let summary = null;
            try { 
              const summaryData = await getChatboxSummary(chatbox.id);
              summary = summaryData?.data?.summary; 
            } catch {}
            
            // Front-End Card show karne ke liye API payload format karo
            return {
              id: chatbox.id, created_at: chatbox.created_at, status: chatbox.status, is_read: chatbox.event_manager_active,
              client_name: detail.data.client?.username || "Unknown", company_name: summary?.company_name || "-",
              artist_name: summary?.artist_genre || "Pending", client_offerings: summary?.budget || "-",
              event_date: summary?.event_date || chatbox.created_at, event_place: summary?.event_location || "-",
              audience_size: summary?.audience_size || "-", event_description: summary?.additional_notes || "Details missing",
            };
          } catch {
            return { id: chatbox.id, created_at: chatbox.created_at, status: chatbox.status, is_read: chatbox.event_manager_active, client_name: "Unknown", company_name: "-", artist_name: "Pending", client_offerings: "-", event_date: chatbox.created_at, event_place: "-", audience_size: "-", event_description: "Missing" };
          }
        })
      );
      setNotifications(detailedRequests);
      setUnreadCount(detailedRequests.filter(n => !n.is_read).length); // sirf naye unread calculate karo
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // Bar bar auto refresh mar ke requests aane do (Polling 30s)
  useEffect(() => { fetchRequests(); const interval = setInterval(fetchRequests, 30000); return () => clearInterval(interval); }, []);
  
  // Jab 'requests' tab pe jao tab latest check kar lo manually
  useEffect(() => { if (activeTab === "requests") fetchRequests(); }, [activeTab]);

  // Search filter
  const filteredNotifications = notifications.filter(n => !searchQuery || n.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) || n.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Card kholte time use backend pe "seen" mark kardo
  const handleOpenChat = async (n) => {
    setSelectedChat(n);
    if (!n.is_read) {
      try {
        await markNotificationRead(n.id);
        // Frontend local state update
        setNotifications(prev => prev.map(p => p.id === n.id ? { ...p, is_read: true } : p));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) { console.error(err); }
    }
  };

  // Kisi event request ko reject/cancel kar dena
  const handleCancel = async (n) => {
    try {
      await cancelPMRequest(n.id);
      setNotifications(prev => prev.filter(p => p.id !== n.id));
      if (!n.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  return { notifications: filteredNotifications, unreadCount, loading, selectedChat, setSelectedChat, fetchRequests, handleOpenChat, handleCancel };
}
