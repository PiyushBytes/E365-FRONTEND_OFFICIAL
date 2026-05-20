import { useState, useEffect, useRef, useCallback } from "react";
import { getChatMessages, enterChatbox, exitChatbox, sendPMReply } from "../../api/chatbot";
import { getBookingByChatbox } from "../../api/booking";
import { useChatWebSocket } from "../chat/useChatWebSocket";
import { secureStorage } from "../../utils/secureStorage";
import { parseArtistRecommendations } from "../../utils/parseArtistRecommendations";

// PM dashboard ki aadhi chat functions isme handle hain
export const usePMChat = (notificationId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const scrollRef = useRef(null);

  const fetchedIdRef = useRef(null);

  const toSafeText = (text) => (typeof text === "string" ? text : text == null ? "" : String(text));

  // Fetch booking to find selected artist
  const fetchSelectedArtist = useCallback(async (chatboxId) => {
    try {
      const res = await getBookingByChatbox(chatboxId);
      const bookings = Array.isArray(res.data) ? res.data : res.data?.results || [];
      
      if (bookings.length > 0) {
        const booking = bookings[0];
        setSelectedArtist({
          artist_id: booking.artist,
          username: booking.artist_username,
          status: booking.status
        });
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
    }
  }, []);

  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prev) => {
      const type = newMessage.sender_type?.toLowerCase() || newMessage.sender?.toLowerCase();
      const role = (type === "client" || type === "user") ? "user" : (type === "pm" || type === "event_manager") ? "pm" : "bot";
      
      const parsed = parseArtistRecommendations(newMessage);
      const incomingText = toSafeText(parsed.text).trim();
      
      // Deduplicate optimistic messages
      const isDupe = prev.slice(-3).some(m => m.role === role && ((m.text || "").trim() === incomingText || (m.content || "").trim() === incomingText));
      if (isDupe) return prev;

      return [
        ...prev,
        {
          id: newMessage.id || "ws-" + Date.now() + Math.floor(Math.random()*100),
          role: role,
          text: incomingText,
          artists: parsed.artists,
          stage: parsed.stage,
          botReply: parsed.botReply,
          time: newMessage.created_at
        }
      ];
    });
  }, []);

  useChatWebSocket(notificationId, handleNewMessage, hasJoined);

  // Sirf chat history load karo bina enter kiye
  useEffect(() => {
    if (fetchedIdRef.current === notificationId) return;
    fetchedIdRef.current = notificationId;

    const load = async () => {
      try {
        const res = await getChatMessages(notificationId);
        const raw = Array.isArray(res.data) ? res.data : [];
        setMessages(
            raw.map((m) => {
              const t = m.sender_type?.toLowerCase() || m.sender?.toLowerCase();
              const parsed = parseArtistRecommendations(m);
              return {
                id: m.id,
                role:
                  t === "client" || t === "user"
                    ? "user"
                    : t === "pm" || t === "event_manager"
                      ? "pm"
                      : "bot",
                text: toSafeText(parsed.text),
                artists: parsed.artists,
                stage: parsed.stage,
                botReply: parsed.botReply,
                time: m.created_at,
              };
            }).filter((msg, index, self) => {
            if (index > 0 && self[index - 1].role === msg.role && (self[index - 1].text || "").trim() === (msg.text || "").trim()) {
              return false; // Skip consecutive duplicates
            }
            return true;
          })
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [notificationId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Join button dbane pe call hoga aur footer change ho jayega
  const join = async () => {
    if (isJoining || hasJoined) return;
    setIsJoining(true);
    try {
      await enterChatbox(notificationId);
      setHasJoined(true);
      
      const storedUser = secureStorage.getItem("user");
      let pmName = "Event Manager";
      if (storedUser) {
        try {
          const parsed = typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;
          pmName = parsed?.first_name || parsed?.username || "Event Manager";
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      }
      
      await sendPMReply(notificationId, `[Project Manager] (${pmName}) has joined the chat and typing for your smooth solution`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsJoining(false);
    }
  };
  const leave = async () => {
    if (hasJoined) {
      try {
        const storedUser = secureStorage.getItem("user");
        let pmName = "Event Manager";
        if (storedUser) {
          try {
            const parsed = typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;
            pmName = parsed?.first_name || parsed?.username || "Event Manager";
          } catch (e) {
            console.error("Failed to parse user", e);
          }
        }
        await sendPMReply(notificationId, `[Project Manager] (${pmName}) has left the chat. I'll continue assisting you.`);
        await exitChatbox(notificationId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const send = async () => {
    if (!input.trim() || !hasJoined) return;
    const txt = input;
    setInput("");
    setIsTyping(false);
    setMessages((p) => [
      ...p,
      {
        id: "t-" + Date.now(),
        role: "pm",
        text: txt,
        isLocal: true,
        time: new Date().toISOString(),
      },
    ]);
    try {
      await sendPMReply(notificationId, txt);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    messages,
    input,
    setInput,
    isTyping,
    loading,
    hasJoined,
    scrollRef,
    join,
    leave,
    send,
    setMessages,
    isJoining,
    selectedArtist,
  };
};
