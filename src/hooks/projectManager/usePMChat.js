import { useState, useEffect, useRef } from "react";
import { getChatMessages, enterChatbox, exitChatbox, sendPMReply } from "../../api/chatbot";

// PM dashboard ki aadhi chat functions isme handle hain
export const usePMChat = (notificationId) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const scrollRef = useRef(null);

  const fetchedIdRef = useRef(null);

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
            return {
              id: m.id,
              role:
                t === "client" || t === "user"
                  ? "user"
                  : t === "pm" || t === "event_manager"
                    ? "pm"
                    : "bot",
              text: m.content || m.text,
              time: m.created_at,
            };
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
    try {
      await enterChatbox(notificationId);
      setHasJoined(true);
    } catch (e) {
      console.error(e);
    }
  };
  const leave = async () => {
    if (hasJoined)
      await exitChatbox(notificationId).catch((err) => {
        console.error(err);
      });
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
  };
};
