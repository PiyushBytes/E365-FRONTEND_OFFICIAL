import { useState, useRef, useEffect } from "react";

// Chat ke saare states handle karna
export const useChatState = () => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatboxId, setChatboxId] = useState(localStorage.getItem("chatboxId") || null);
  const [messages, setMessages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState("home");
  const scrollRef = useRef(null);

  // Naya message aane pe auto scroll karna
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Chat ko clear karke home pe aana
  const reset = () => {
    setChatboxId(null);
    localStorage.removeItem("chatboxId");
    setMessages([]);
    setSubmitted(false);
    setView("home");
  };

  return {
    input, setInput, isTyping, setIsTyping, chatboxId, setChatboxId,
    messages, setMessages, submitted, setSubmitted, view, setView, scrollRef, reset
  };
};
