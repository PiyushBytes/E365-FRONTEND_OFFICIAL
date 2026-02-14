import { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm the E365 Assistant. How can I help you plan your event today?",
    },
  ]);

  const scrollRef = useRef(null);

  // 👉 change this to your backend API
  const API_URL = "http://192.168.1.11:5000/api/bot/message";

  // session id for conversation memory
  const sessionId = "demo1";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ✅ API CALL FUNCTION
  const fetchBotReply = async (userMessage) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          message: userMessage,
        }),
      });

      const data = await res.json();

      setIsTyping(false);

      // add bot reply
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: data.reply,
          },
        ]);
      }

      // if backend sends options → show as clickable buttons
      if (data.type === "options" && data.options) {
        setMessages((prev) => [
          ...prev,
          {
            role: "options",
            options: data.options,
          },
        ]);
      }
    } catch (error) {
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Server error. Please try again.",
        },
      ]);
    }
  };

  // ✅ SEND MESSAGE
  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    fetchBotReply(input);
  };

  // when user clicks option button
  const handleOptionClick = (option) => {
    const userMsg = { role: "user", text: option };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    fetchBotReply(option);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {open && (
        <div className="w-80 h-[500px] bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4">
          
          {/* HEADER */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-white tracking-wide text-sm">
                E365 Assistant
              </span>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* CHAT BODY */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-900 scroll-smooth"
          >
            {messages.map((msg, i) => {
              // user / bot messages
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

              // options buttons
              if (msg.role === "options") {
                return (
                  <div key={i} className="flex flex-wrap gap-2">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-slate-700 text-white px-3 py-2 rounded-lg text-xs hover:bg-slate-600"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                );
              }

              return null;
            })}

            {/* typing animation */}
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
                className="w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-600 rounded-xl text-sm text-white focus:outline-none"
              />

              <button
                onClick={handleSend}
                className="absolute right-3 text-blue-500 hover:text-blue-400"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 bg-white text-black pl-5 pr-6 py-3 rounded-full shadow-xl"
      >
        <span className="bg-black text-white p-1 rounded-full">💬</span>
        <span className="font-bold text-xs uppercase tracking-widest">
          Live Help
        </span>
      </button>
    </div>
  );
}