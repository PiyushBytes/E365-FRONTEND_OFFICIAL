import { useState, useEffect, useRef } from "react";
import { initChatbox, sendChatMessage, getChatMessages, submitRequestToPM, getLatestMessages } from "../api/chatbot";
export function useChatEngine() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatboxId, setChatboxId] = useState(localStorage.getItem("chatboxId") || null);
  const [messages, setMessages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState("home");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    let pollInterval;
    if (chatboxId && view === "chat") {
      pollInterval = setInterval(async () => {
        try {
          const r = await getLatestMessages(chatboxId);
          const rawData = r.data || [];
          const loaded = rawData.map((m) => {
            const type = m.sender_type?.toLowerCase() || m.sender?.toLowerCase();
            return {
              id: m.id,
              role: (type === "client" || type === "user") ? "user" : (type === "event_manager" || type === "pm") ? "pm" : "bot",
              text: m.content || m.text || "",
              username: m.sender_username,
              time: m.created_at
            };
          });

          setMessages((prev) => {
            const currentIds = new Set(prev.map(p => p.id));
            const newMessages = loaded.filter(m => !currentIds.has(m.id));
            
            if (newMessages.length > 0) {
              const nextState = [...prev];
              newMessages.forEach(newMsg => {
                 const localIdx = nextState.findIndex(p => p.isLocal && p.role === newMsg.role && p.text.trim() === newMsg.text.trim());
                 if (localIdx !== -1) {
                      nextState.splice(localIdx, 1);
                 }
              });
              return [...nextState, ...newMessages];
            }
            return prev;
          });
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 1000);
    }
    return () => clearInterval(pollInterval);
  }, [chatboxId, view]);

  const init = async () => {
    try {
      let id = localStorage.getItem("chatboxId") || chatboxId;
      if (id && id !== chatboxId) {
        setChatboxId(id);
      }

      if (!id) {
        setIsTyping(true);
        const r = await initChatbox();
        id = r.data.id || r.data.chatbox_id;
        if (id) { setChatboxId(id); localStorage.setItem("chatboxId", id); }
        setIsTyping(false);
      } else {
        const r = await getChatMessages(id);
        const rawData = r.data?.results || r.data?.messages || r.data || [];
        const messagesArray = Array.isArray(rawData) ? rawData : [];
        const loaded = messagesArray.map((m) => {
          const type = m.sender_type?.toLowerCase() || m.sender?.toLowerCase();
          return { id: m.id, role: (type === "client" || type === "user") ? "user" : (type === "event_manager" || type === "pm") ? "pm" : "bot", text: m.content, username: m.sender_username, time: m.created_at };
        });
        setMessages(loaded);
        if (loaded.length) setView("chat");
      }
    } catch (e) { console.error("Chat init:", e); setIsTyping(false); }
  };

  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    
    setIsTyping(true);
    let currentId = chatboxId;

    // Auto-initialize if it hasn't finished loading yet or is null
    if (!currentId) {
      try {
        const r = await initChatbox();
        currentId = r.data.id || r.data.chatbox_id;
        if (currentId) {
          setChatboxId(currentId);
          localStorage.setItem("chatboxId", currentId);
        } else {
          throw new Error("Chatbox ID not received");
        }
      } catch (e) {
        setIsTyping(false);
        setMessages((p) => [...p, { id: 'error-'+Date.now(), role: "bot", text: "⚠️ Error initializing chatbox." }]);
        return;
      }
    }

    setView("chat");
    setMessages((p) => [...p, { id: 'temp-'+Date.now(), role: "user", text: msg, isLocal: true }]);
    setInput("");

    try {
      const { data: d } = await sendChatMessage(currentId, msg);
      // Immediately show bot reply without waiting for next poll
      if (d?.bot_reply) {
        setIsTyping(false);
        setMessages((p) => [...p, { id: 'temp-bot-'+Date.now(), role: "bot", text: d.bot_reply, time: new Date().toISOString(), isLocal: true }]);
      }
      if (d?.all_fields_collected && !submitted) {
        setSubmitted(true);
        await submitRequestToPM(currentId);
        setMessages((p) => [...p, { id: 'temp-bot-submit-'+Date.now(), role: "bot", text: "✅ Your request has been sent to our Event Manager!", time: new Date().toISOString(), isLocal: true }]);
      }
    } catch (error) {
      setIsTyping(false);
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.response?.statusText || error.message || "Server error";
      setMessages((p) => [...p, { id: 'error-'+Date.now(), role: "bot", text: `⚠️ ${errMsg}`, time: new Date().toISOString() }]);
    }
  };



  const reset = () => { setChatboxId(null); localStorage.removeItem("chatboxId"); setMessages([]); setSubmitted(false); setView("home"); };

  return { input, setInput, isTyping, messages, view, scrollRef, init, send, reset };
}
