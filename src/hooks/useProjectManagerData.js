import { useState, useEffect } from "react";
import { getAllQueries, markNotificationRead, cancelPMRequest } from "../api/notifications";

export function useProjectManagerData(activeTab, searchQuery) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllQueries(); // GET /api/query/all/ fetches all queries in one go
      
      // Backend uses { count, queries: [...] } wrapper
      const rawData = res.data;
      const queriesList = Array.isArray(rawData) ? rawData : (rawData?.queries || rawData?.results || rawData?.data || []);
      
      const detailedRequests = queriesList.map((query) => {
        // Handle chatbox ID (it comes as a UUID string in this API)
        const chatboxId = typeof query.chatbox === "string" ? query.chatbox : (query.chatbox?.id || query.id);
        
        return {
          id: chatboxId, // Needed for opening chat/cancel interactions
          query_id: query.id,
          created_at: query.created_at || new Date().toISOString(),
          status: query.is_complete ? "Complete" : "Pending",
          is_read: true, // Assuming true since we don't have event_manager_active here directly
          client_name: "Client", // Add client username from chatbox relation if needed later
          company_name: "-",
          artist_name: query.artist_genre || "Pending",
          client_offerings: query.budget || "-",
          event_date: query.event_date || "-",
          event_place: query.event_location || "-",
          audience_size: query.event_type || "-", // mapped event type to show some detail
          event_description: query.additional_notes || "Details missing",
        };
      });

      // Filter out any invalid malformed records just in case
      const validRequests = detailedRequests.filter(r => r.id);
      
      setNotifications(validRequests);
      setUnreadCount(validRequests.filter(n => !n.is_read).length);
    } catch (err) { 
      console.error("Failed to fetch PM inquiries:", err); 
    } finally { 
      setLoading(false); 
    }
  };

// Unconditional fetch on mount removed to prevent unnecessary API calls
  
  useEffect(() => { if (activeTab === "requests") fetchRequests(); }, [activeTab]);

  const filteredNotifications = notifications.filter(n => 
    !searchQuery || 
    n.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.artist_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenChat = async (n) => {
    setSelectedChat(n);
  };

  const markChatAsRead = async (id) => {
    try {
      setNotifications(prev => prev.map(p => p.id === id ? { ...p, is_read: true } : p));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleCancel = async (n) => {
    try {
      await cancelPMRequest(n.id);
      setNotifications(prev => prev.filter(p => p.id !== n.id));
      if (!n.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  return { notifications: filteredNotifications, unreadCount, loading, selectedChat, setSelectedChat, fetchRequests, handleOpenChat, handleCancel, markChatAsRead };
}