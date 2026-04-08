import { useState, useEffect, useRef } from "react";
import { initChatbox, sendChatMessage, getChatMessages, submitRequestToPM } from "../api/chatbot";

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

  const init = async () => {
    try {
      let id = chatboxId;
      if (!id) {
        setIsTyping(true);
        const r = await initChatbox();
        id = r.data.id || r.data.chatbox_id;
        if (id) { setChatboxId(id); localStorage.setItem("chatboxId", id); }
        setIsTyping(false);
      } else {
        const r = await getChatMessages(id);
        const loaded = r.data.map((m) => ({ role: m.sender === "user" ? "user" : "bot", text: m.content }));
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
        setMessages((p) => [...p, { role: "bot", text: "⚠️ Error initializing chatbox." }]);
        return;
      }
    }

    setView("chat");
    setMessages((p) => [...p, { role: "user", text: msg }]);
    setInput("");

    try {
      const { data: d } = await sendChatMessage(currentId, msg);
      setIsTyping(false);
      if (d?.bot_reply) setMessages((p) => [...p, { role: "bot", text: d.bot_reply }]);
      // if (d?.missing_fields?.length) setMessages((p) => [...p, { role: "bot", text: "Please provide: " + d.missing_fields.join(", ") }]);
      if (d?.all_fields_collected && !submitted) { setSubmitted(true); await submitRequestToPM(currentId); setMessages((p) => [...p, { role: "bot", text: "✅ Request sent to our Project Manager!" }]); }
    } catch (error) {
      setIsTyping(false);
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.response?.statusText || error.message || "Server error";
      setMessages((p) => [...p, { role: "bot", text: `⚠️ Error: ${errMsg}` }]);
    }
  };

  const reset = () => { setChatboxId(null); localStorage.removeItem("chatboxId"); setMessages([]); setSubmitted(false); setView("home"); };

  return { input, setInput, isTyping, messages, view, scrollRef, init, send, reset };
}
