import { useState, useEffect, useRef, useCallback } from "react";
import { getChatMessages, enterChatbox, exitChatbox, sendPMReply } from "../../api/chatbot";
import { useChatWebSocket } from "../chat/useChatWebSocket";
import { secureStorage } from "../../utils/secureStorage";

// PM dashboard ki aadhi chat functions isme handle hain
export const usePMChat = (notificationId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const scrollRef = useRef(null);

  const fetchedIdRef = useRef(null);

  const handleNewMessage = useCallback((newMessage) => {
    setMessages((prev) => {
      const type = newMessage.sender_type?.toLowerCase() || newMessage.sender?.toLowerCase();
      const role = (type === "client" || type === "user") ? "user" : (type === "pm" || type === "event_manager") ? "pm" : type === "system" ? "system" : "bot";
      const incomingText = (newMessage.content || newMessage.text || "").trim();
      
      // Deduplicate optimistic messages
      const isDupe = prev.slice(-3).some(m => m.role === role && ((m.text || "").trim() === incomingText || (m.content || "").trim() === incomingText));
      if (isDupe) return prev;

      return [
        ...prev,
        {
          id: newMessage.id || "ws-" + Date.now() + Math.floor(Math.random()*100),
          role: role,
          text: incomingText,
          time: newMessage.created_at
        }
      ];
    });
  }, []);

  useChatWebSocket(notificationId, handleNewMessage, hasJoined);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await getChatMessages(notificationId);
      const raw = Array.isArray(res.data) ? res.data : [];
      setMessages(
        raw.map((m) => {
          const t = m.sender_type?.toLowerCase() || m.sender?.toLowerCase();
          return {
            id: m.id,
            role:
              t === "client" || t === "user"
                ? "user"
                : t === "pm" || t === "event_manager"
                  ? "pm"
                  : t === "system" ? "system" : "bot",
            text: m.content || m.text,
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

  // Sirf chat history load karo bina enter kiye
  useEffect(() => {
    if (fetchedIdRef.current === notificationId) return;
    fetchedIdRef.current = notificationId;
    loadMessages();
  }, [notificationId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const join = async () => {
    try {
      await enterChatbox(notificationId);
      setHasJoined(true);
    } catch (e) {
      console.error(e);
    }
  };
  const leave = async () => {
    if (hasJoined) {
      try {
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
    loadMessages,
  };
};
