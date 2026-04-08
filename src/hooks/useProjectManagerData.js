import { useState, useEffect } from "react";
import { getPMRequests, getPMRequestDetail, markNotificationRead, cancelPMRequest } from "../api/notifications";
import { getChatboxSummary } from "../api/chatbot";

export function useProjectManagerData(activeTab, searchQuery) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getPMRequests();
      const detailedRequests = await Promise.all(
        res.data.map(async (chatbox) => {
          try {
            const detail = await getPMRequestDetail(chatbox.id);
            const summaryData = await getChatboxSummary(chatbox.id);
            const summary = summaryData?.data?.summary; 
            
            return {
              id: chatbox.id, 
              created_at: chatbox.created_at, 
              status: chatbox.status, 
              is_read: chatbox.event_manager_active,
              // Mapping client name from nested detail object
              client_name: detail.data?.client?.username || detail.data?.username || "Client", 
              company_name: summary?.company_name || "-",
              artist_name: summary?.artist_genre || "Pending", 
              client_offerings: summary?.budget || "-",
              event_date: summary?.event_date || chatbox.created_at, 
              event_place: summary?.event_location || "-",
              audience_size: summary?.audience_size || "-", 
              event_description: summary?.additional_notes || "Details missing",
            };
          } catch {
            return { ...chatbox, client_name: "Client", artist_name: "Pending" };
          }
        })
      );
      setNotifications(detailedRequests);
      setUnreadCount(detailedRequests.filter(n => !n.is_read).length);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchRequests(); 
    const interval = setInterval(fetchRequests, 30000); 
    return () => clearInterval(interval); 
  }, []);
  
  useEffect(() => { if (activeTab === "requests") fetchRequests(); }, [activeTab]);

  const filteredNotifications = notifications.filter(n => 
    !searchQuery || 
    n.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.artist_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenChat = async (n) => {
    setSelectedChat(n);
    if (!n.is_read) {
      try {
        await markNotificationRead(n.id);
        setNotifications(prev => prev.map(p => p.id === n.id ? { ...p, is_read: true } : p));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) { console.error(err); }
    }
  };

  const handleCancel = async (n) => {
    try {
      await cancelPMRequest(n.id);
      setNotifications(prev => prev.filter(p => p.id !== n.id));
      if (!n.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  return { notifications: filteredNotifications, unreadCount, loading, selectedChat, setSelectedChat, fetchRequests, handleOpenChat, handleCancel };
}