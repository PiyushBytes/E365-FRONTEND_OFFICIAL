import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { getChatMessages, sendChatMessage } from "../../api/chatbot";

const PMChatModal = ({ notification, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await getChatMessages(notification.id);
        const formatted = res.data.map((msg) => ({
          role: msg.sender_type === "bot" ? "bot" : "user",
          text: msg.content,
          time: msg.created_at,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [notification.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const pmMsg = { role: "pm", text: input };
    setMessages((prev) => [...prev, pmMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const res = await sendChatMessage(notification.id, input);
      const data = res.data;
      setIsTyping(false);
      if (data?.bot_reply) {
        setMessages((prev) => [...prev, { role: "bot", text: data.bot_reply }]);
      }
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Failed to send message." },
      ]);
    }
  };

  const getBubbleStyle = (role) => {
    if (role === "pm") return "bg-purple-600 text-white self-end ml-auto";
    if (role === "user") return "bg-blue-600 text-white self-end ml-auto";
    return "bg-slate-700 text-white self-start";
  };

  const getSenderLabel = (role) => {
    if (role === "pm") return "You (PM)";
    if (role === "user") return notification.client_name || "Client";
    return "E365 Bot";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[600px]">

        {/* HEADER */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-white font-bold text-lg">
              Chat with {notification.client_name || "Client"}
            </h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Request for {notification.artist_name || "Artist"} —{" "}
              {notification.event_place || "Location TBD"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={22} />
          </button>
        </div>

        {/* LEGEND */}
        <div className="flex items-center gap-4 px-4 py-2 bg-slate-900 border-b border-slate-700 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span className="text-gray-400">Client</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
            <span className="text-gray-400">Bot</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
            <span className="text-gray-400">You (PM)</span>
          </span>
        </div>

        {/* MESSAGES */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-900"
        >
          {loading ? (
            <div className="text-gray-400 text-center py-10">Loading conversation...</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500 text-center py-10">No messages yet.</div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[75%] ${
                  msg.role === "bot" ? "self-start" : "self-end ml-auto"
                }`}
              >
                <span className="text-[10px] text-gray-500 mb-1 px-1">
                  {getSenderLabel(msg.role)}
                </span>
                <div className={`p-3 rounded-xl text-sm ${getBubbleStyle(msg.role)}`}>
                  {msg.text}
                </div>
                {msg.time && (
                  <span className="text-[10px] text-gray-600 mt-1 px-1 self-end">
                    {new Date(msg.time).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            ))
          )}
          {isTyping && <div className="text-gray-400 text-sm">Typing...</div>}
        </div>

        {/* INPUT */}
        <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2 rounded-b-2xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message to client..."
            className="flex-1 p-3 rounded-xl bg-slate-900 text-white text-sm placeholder-gray-500 outline-none border border-slate-700 focus:border-purple-500 transition"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-xl transition flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PMChatModal;
