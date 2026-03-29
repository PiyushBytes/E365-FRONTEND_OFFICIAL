import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { initChatbox, sendChatMessage } from "../api/chatbot";
import { useAuth } from "../context/AuthContext";

const ChatWidget = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatboxId, setChatboxId] = useState(localStorage.getItem('chatboxId') || null);
  const wsRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const { user } = useAuth();
  const scrollRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: (initialMessage) => {
      setOpen(true);
      if (initialMessage) {
        // Optionally handle initial message or context here
        // For now, we just open the chat
        // You could also auto-send a message:
        // handleSend(initialMessage); 
      }
    },
    close: () => setOpen(false)
  }));

  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  
  useEffect(() => {
    // Determine WebSocket base URL. If VITE_API_BASE_URL is http://localhost:8000/api, we might need ws://localhost:8000/ws
    // Assuming relative path or specific env variable for WS, fallback to standard:
    const wsBaseUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";

    if (open) {
      const setupChatbox = async () => {
        try {
          let currentId = chatboxId;
          if (!currentId) {
            setIsTyping(true);
            const res = await initChatbox();
            currentId = res.data.id || res.data.chatbox_id;
            if(currentId) {
              setChatboxId(currentId);
              localStorage.setItem('chatboxId', currentId);
            }
            setIsTyping(false);
          }

          if (currentId && !wsRef.current) {
            const ws = new WebSocket(`${wsBaseUrl}/chat/${currentId}/`);
            wsRef.current = ws;

            ws.onmessage = (event) => {
              const data = JSON.parse(event.data);
              setIsTyping(false);
              
              if (data.reply || data.message || data.text) {
                setMessages((prev) => [
                  ...prev,
                  { role: "bot", text: data.reply || data.message || data.text },
                ]);
              }
              if (data.type === "options" && data.options) {
                 setMessages((prev) => [
                   ...prev,
                   { role: "options", options: data.options },
                 ]);
              }
            };
          }
        } catch (err) {
          console.error("Chat initialization failed:", err);
          setIsTyping(false);
        }
      };
      
      setupChatbox();
    }

    return () => {
      // Cleanup websocket on unmount or close? Usually keep open while chat open
      /* if(wsRef.current && !open) {
         wsRef.current.close();
         wsRef.current = null;
      } */
    };
  }, [open, chatboxId]);

  const fetchBotReply = async (userMessage) => {
    if (!chatboxId) return;
    try {
      await sendChatMessage(chatboxId, userMessage);
      // We do not set messages here directly as the WebSocket will listen and set the bot reply.
      // But we can keep it for fallback if HTTP response contains reply.
    } catch (error) {
      setIsTyping(false);
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Please try again." },
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    fetchBotReply(userMsg.text);
  };

  const handleOptionClick = (option) => {
    const userMsg = { role: "user", text: option };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    fetchBotReply(option);
  };

  const handleNewChat = () => {
    if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
    }
    setChatboxId(null);
    localStorage.removeItem('chatboxId');
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {open && (
        <div className="w-80 h-500px bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4">
          
          {/* HEADER */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-white tracking-wide text-sm">
                E365 Assistant
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <button onClick={handleNewChat} className="text-slate-400 hover:text-white pb-1 font-bold text-lg" title="Start New Chat">
                +
              </button>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white" title="Close">
                ✕
              </button>
            </div>
          </div>

          {/* CHAT BODY */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-900 scroll-smooth">
            {messages.map((msg, i) => {
              if (msg.role === "user" || msg.role === "bot") {
                return (
                  <div
                    key={i}
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white self-end rounded-tr-none"
                        : "bg-slate-800 text-slate-200 self-start rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                );
              }

              if (msg.role === "options") {
                return (
                  <div key={i} className="flex flex-wrap gap-2">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-slate-700 text-white px-3 py-2 rounded-lg text-xs hover:bg-slate-600 transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })}

            {isTyping && (
              <div className="bg-slate-800 text-slate-200 self-start p-3 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about artists..."
                className="w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button onClick={handleSend} className="absolute right-3 text-blue-500 hover:text-blue-400">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 bg-white text-black pl-5 pr-6 py-3 rounded-full shadow-xl hover:scale-105 transition-transform"
      >
        <span className="bg-black text-white p-1 rounded-full">💬</span>
        <span className="font-bold text-xs uppercase tracking-widest">
          Live Help
        </span>
      </button>
    </div>
  );
});

export default ChatWidget;