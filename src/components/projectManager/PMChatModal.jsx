import React, { useState, useEffect, useRef } from "react";
import { Zap, RefreshCw, X, Send, Sparkles, User as UserIcon, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatMessages, enterChatbox, exitChatbox, sendPMReply, getLatestMessages } from "../../api/chatbot";

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-slate-500/20 bg-slate-800 border border-slate-700">
    <Sparkles size={14} className="text-slate-400" />
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-emerald-500/20 bg-emerald-900 border border-emerald-700/50">
    <UserIcon size={14} className="text-emerald-400" />
  </div>
);

const PMChatModal = ({ notification, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // 1 & 2. HANDOFF LOGIC & LOAD HISTORY
  useEffect(() => {
    const loadFullHistory = async () => {
      try {
        const res = await getChatMessages(notification.id);
        const rawData = Array.isArray(res.data) ? res.data : [];
        const formatted = rawData.map((msg) => {
          const type = msg.sender_type?.toLowerCase() || msg.sender?.toLowerCase();
          return {
            id: msg.id,
            role: (type === "client" || type === "user") ? "user" : (type === "event_manager" || type === "pm") ? "pm" : "bot",
            text: msg.content || msg.text || "",
            time: msg.created_at,
            username: msg.sender_username,
          };
        });
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    const initSessionAndLoad = async () => {
      try {
        await enterChatbox(notification.id);
        await loadFullHistory();
      } catch (err) {
        console.error("Failed to init chat:", err);
        setLoading(false);
      }
    };

    initSessionAndLoad();
  }, [notification.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    let pollInterval;
    if (notification.id && !loading) {
      pollInterval = setInterval(async () => {
        try {
          const res = await getLatestMessages(notification.id);
          const rawData = Array.isArray(res.data) ? res.data : [];
          const formatted = rawData.map((msg) => {
            const type = msg.sender_type?.toLowerCase() || msg.sender?.toLowerCase();
            return {
              id: msg.id,
              role: (type === "client" || type === "user") ? "user" : (type === "event_manager" || type === "pm") ? "pm" : "bot",
              text: msg.content || msg.text || "",
              time: msg.created_at,
              username: msg.sender_username,
            };
          });

          setMessages((prev) => {
            const currentIds = new Set(prev.map(p => p.id));
            const newMessages = formatted.filter(m => !currentIds.has(m.id));
            
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
        } catch (err) {
          console.error("Poll err:", err);
        }
      }, 1000);
    }
    return () => clearInterval(pollInterval);
  }, [notification.id, loading]);

  // 3. SEND PM REPLY
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const content = input;
    const pmMsg = { id: "temp-pm-" + Date.now(), role: "pm", text: content, time: new Date().toISOString(), isLocal: true };
    setMessages((prev) => [...prev, pmMsg]);
    setInput("");
    setIsTyping(false);

    try {
      await sendPMReply(notification.id, content);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: "error-" + Date.now(), role: "bot", text: "⚠️ Failed to send message." },
      ]);
    }
  };

  const clearChatLocal = () => {
    setMessages([]);
  };

  const activeInput = input.trim() && !isTyping;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #020817 0%, #0a1628 40%, #050d1a 100%)",
        }}
      >
        {/* Grid dot pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
          style={{
            backgroundImage: "radial-gradient(rgba(56,130,246,0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Ambient glows */}
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-500/[0.07] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-indigo-600/[0.07] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/[0.03] blur-[100px] rounded-full pointer-events-none" />
          
        <div className="w-full h-full max-w-6xl mx-auto flex flex-col relative z-10">
            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-5 relative z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20"
                    style={{ background: "linear-gradient(135deg, #7e22ce, #a855f7)" }}
                  >
                    <Zap size={18} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#020817]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight">Chat with {notification.client_name || "Client"}</h3>
                  <p className="text-xs text-purple-400/70 font-medium mt-0.5 tracking-wide uppercase">Live Handoff Active</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={clearChatLocal} title="New Conversation"
                  className="w-9 h-9 rounded-xl bg-[#0B1221] hover:bg-[#1A2642] border border-blue-400/20 flex items-center justify-center text-blue-300 hover:text-white transition-all shadow-md hover:border-blue-400"
                >
                  <RefreshCw size={15} />
                </button>
                <button 
                  onClick={() => {
                    exitChatbox(notification.id).catch((err) => console.error("Exit failed:", err));
                    onClose();
                  }}  
                  title="Close"
                  className="w-9 h-9 rounded-xl bg-[#0B1221] hover:bg-red-900/30 border border-blue-400/20 hover:border-red-500/50 flex items-center justify-center text-blue-300 hover:text-red-400 transition-all shadow-md"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* MESSAGES LIST */}
            <div className="flex-1 overflow-y-auto scrollbar-hide w-full flex flex-col">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-50 px-8 max-w-xl mx-auto text-center">
                  <Zap className="text-blue-400 w-12 h-12 mb-4" />
                  <h4 className="text-white font-bold text-lg mb-2">No Previous Concept Iterations</h4>
                  <p className="text-gray-400 text-[14px]">Send the first message to kick off the project manager discussion.</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  ref={scrollRef} className="h-full px-8 py-4 overflow-y-auto flex flex-col gap-6 scrollbar-hide max-w-3xl mx-auto w-full"
                >
                  {messages.filter((msg, i, arr) => {
                    // Deduplicate consecutive identical system alerts
                    if (i > 0 && arr[i - 1].text === msg.text && /has joined|has left/i.test(msg.text)) {
                      return false;
                    }
                    return true;
                  }).map((msg, i) => {
                    const isSystem = /has joined the chat|has left the chat|continue assisting you/i.test(msg.text);
                    
                    if (isSystem) {
                      const match = msg.text.match(/^\[(.*?)\] \((.*?)\) (.*)/);
                      let content = msg.text;
                      
                      if (match) {
                        content = (
                          <>
                            <span className="text-white font-bold uppercase tracking-wider">{match[1]}</span>{" "}
                            <span className="text-blue-400/90">({match[2]})</span>{" "}
                            <span className="text-slate-300 ml-1">{match[3]}</span>
                          </>
                        );
                      }

                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center w-full my-4">
                          <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-800/60 to-blue-900/40 border border-blue-500/20 flex items-center gap-3 shadow-lg shadow-blue-900/20 backdrop-blur-md">
                            <div className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                            </div>
                            <span className="text-[12px] text-slate-300 tracking-wide flex items-center">
                              {content}
                            </span>
                          </div>
                        </motion.div>
                      );
                    }

                    const isPM = msg.role === "pm";
                    const isUser = msg.role === "user";
                    const isBot = msg.role === "bot";
                    
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${isPM ? "items-end" : "items-start"} gap-1 w-full`}
                      >
                        {/* Label for left side */}
                        {!isPM && (
                          <span className="text-[11px] text-gray-500 ml-12 font-medium tracking-wide uppercase">
                            {isBot ? "E365 Bot" : (notification.client_name || "Client")}
                          </span>
                        )}
                        
                        <div className={`flex ${isPM ? "justify-end" : "justify-start"} gap-3 w-full`}>
                          {!isPM && (isBot ? <BotAvatar /> : <UserAvatar />)}
                          
                          <div
                            className={`max-w-[75%] text-[14px] leading-relaxed px-5 py-3.5 ${
                              isPM ? "text-white rounded-2xl rounded-br-md" : "text-gray-200 rounded-2xl rounded-bl-md"
                            }`}
                            style={isPM
                              ? { background: "linear-gradient(135deg, #1d4ed8, #2563eb)", boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }
                              : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }
                            }
                          >
                            {msg.text}
                          </div>
                        </div>

                        {/* Timestamp for PM side */}
                        {isPM && msg.time && (
                          <span className="text-[10px] text-gray-600 mt-0.5 mr-1 font-medium">
                            {new Date(msg.time).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="flex justify-start gap-3 w-full">
                      <UserAvatar />
                      <div className="px-5 py-4 rounded-2xl rounded-bl-md flex gap-2"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* INPUT FOOTER */}
            <div className="px-8 pb-8 pt-4 relative z-20 max-w-3xl mx-auto w-full">
              <div className="flex items-center gap-2 rounded-2xl p-1.5 transition-all bg-[#0B1221] border border-blue-400/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] focus-within:border-cyan-400/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Direct message to client (Bot is paused)..."
                  className="flex-1 bg-transparent border-none outline-none px-5 py-3.5 text-[15px] text-white placeholder-blue-200/40 font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!activeInput}
                  className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${activeInput ? "text-white" : "text-blue-200/20 cursor-not-allowed"}`}
                  style={activeInput
                    ? { background: "linear-gradient(135deg, #0284c7, #22d3ee)", boxShadow: "0 0 15px rgba(34,211,238,0.4)" }
                    : { background: "rgba(56,130,246,0.1)" }
                  }
                >
                  <Send size={17} className={activeInput ? "ml-0.5" : ""} />
                </button>
              </div>
            </div>
          </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PMChatModal;