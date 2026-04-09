// Yeh hook client dashboard ka poora data aur messages state ko handle karta hai
import { useState, useEffect } from "react";
import { getChatboxSummary, getAllChatboxes, getChatMessages } from "../api/chatbot";

export function useClientData(activeTab) {
  // Client ke static stats aur overview data ke liye state
  const [data, setData] = useState({ profile: {}, stats: {}, activeBookings: [], recommendedArtists: [], messages: [] });
  // Event query details store karne ke liye
  const [querySummary, setQuerySummary] = useState(null);

  // Dm/chat se related saari states hain yeh
  const [chatboxes, setChatboxes] = useState([]);
  const [selectedChatbox, setSelectedChatbox] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Component start hote hi user ka summary details fetch karo
  useEffect(() => {
    fetch("/static/client_dashboard_data.json").then((res) => res.json()).then(setData).catch(console.error);
    const chatboxId = localStorage.getItem("chatboxId");
    if (chatboxId) getChatboxSummary(chatboxId).then((res) => setQuerySummary(res.data)).catch(console.error);
  }, []);

  // Agar user 'messages' tab me jata hai, to saare chats list laao background mein
  useEffect(() => {
    if (activeTab === "messages") {
      getAllChatboxes().then((res) => setChatboxes(res.data)).catch(console.error);
    }
  }, [activeTab]);

  // Handle function: jab user kisi chat ko click karke open karta hai
  const handleSelectChatbox = async (chatbox) => {
    setSelectedChatbox(chatbox); 
    setLoadingMessages(true);
    try {
      const res = await getChatMessages(chatbox.id);
      const rawData = res.data?.results || res.data?.messages || res.data || [];
      const messagesArray = Array.isArray(rawData) ? rawData : [];
      setChatMessages(messagesArray.map((msg) => {
        const type = msg.sender_type?.toLowerCase() || msg.sender?.toLowerCase();
        return { 
          role: (type === "client" || type === "user") ? "user" : (type === "event_manager" || type === "pm") ? "pm" : "bot", 
          text: msg.content, 
          time: msg.created_at,
          username: msg.sender_username
        };
      }));
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoadingMessages(false); 
    }
  };

  // Jo bhi chahiye data aur functions woh pass return karlo taki UI me use ho sake
  return { 
    data, 
    querySummary, 
    chatboxes, 
    selectedChatbox, 
    setSelectedChatbox, 
    chatMessages, 
    setChatMessages, 
    loadingMessages, 
    handleSelectChatbox 
  };
}