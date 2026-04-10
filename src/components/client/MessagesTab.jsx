import React, { useState, useEffect } from "react";
import { ChevronLeft, MessageSquare, Edit2, Check, MessageCircle } from "lucide-react";

export default function MessagesTab({ chatboxes, selectedChatbox, setSelectedChatbox, chatMessages, setChatMessages, loadingMessages, handleSelectChatbox }) {
  const [titles, setTitles] = useState(() => JSON.parse(localStorage.getItem("chatTitles") || "{}"));
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const saveTitle = (id) => {
    const newTitles = { ...titles, [id]: editValue };
    setTitles(newTitles);
    localStorage.setItem("chatTitles", JSON.stringify(newTitles));
    setEditingId(null);
  };

  const handleContinueChat = () => {
    localStorage.setItem("chatboxId", selectedChatbox.id);
    window.dispatchEvent(new CustomEvent("open-chat-widget"));
  };
  
  if (selectedChatbox) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => { setSelectedChatbox(null); setChatMessages([]); }} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ChevronLeft size={18} /> Back to all chats</button>
        <div className="bg-slate-800 rounded-xl p-5 mb-6 border border-slate-700 flex justify-between items-center group">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">{titles[selectedChatbox.id] || `Conversation #${selectedChatbox.id.slice(0, 8)}`}</h3>
            <p className="text-gray-400 text-sm">Created: {new Date(selectedChatbox.created_at).toLocaleDateString("en-IN")}</p>
          </div>
          <button 
            onClick={handleContinueChat}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <MessageCircle size={16} />
            Continue Chat
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {loadingMessages ? (
            <div className="text-gray-400 text-center py-10">Loading messages...</div>
          ) : chatMessages.length === 0 ? (
            <div className="text-gray-400 text-center py-10">No messages found</div>
          ) : (
            chatMessages.map((msg, i) => {
              // Robust mapping for role and text
              const role = msg.sender_type || msg.role || "bot";
              const text = msg.content || msg.text || "";
              return (
                <div key={i} className={`flex flex-col max-w-[75%] ${role === "user" ? "self-end ml-auto" : "self-start"}`}>
                  <span className="text-[10px] text-gray-500 mb-1 px-1 capitalize">
                    {msg.username ? msg.username.replace('_', ' ') : (role === "user" ? "You" : role === "pm" ? "Manager" : "E365 Bot")}
                  </span>
                  <div className={`p-3 rounded-xl text-white text-sm ${role === "user" ? "bg-blue-600" : role === "pm" ? "bg-purple-600" : "bg-slate-700"}`}>
                    {text}
                    {(msg.time || msg.created_at) && (
                      <div className="text-[9px] text-gray-300 mt-1 text-right">
                        {new Date(msg.time || msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Conversations</h2>
      {chatboxes.length === 0 ? (
        <div className="text-gray-400 text-center py-20"><MessageSquare size={48} className="mx-auto mb-4 opacity-30" /><p>No conversations yet.</p></div>
      ) : (
        <div className="flex flex-col gap-4">
          {chatboxes.map((c) => (
            <div key={c.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row justify-between group transition-all hover:bg-slate-700/50 cursor-pointer" onClick={() => handleSelectChatbox(c)}>
              <div className="flex-1">
                {editingId === c.id ? (
                  <div className="flex items-center gap-2 mb-1" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="text" 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)} 
                      className="bg-slate-900 text-white border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 w-full max-w-[200px]"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveTitle(c.id)}
                    />
                    <button onClick={() => saveTitle(c.id)} className="text-green-400 hover:text-green-300"><Check size={16} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1 group/title">
                    <p className="text-white font-semibold">
                      {titles[c.id] || `Chat ID: ${c.id.slice(0, 8)}...`}
                    </p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingId(c.id); setEditValue(titles[c.id] || `Chat ID: ${c.id.slice(0, 8)}`); }}
                      className="text-gray-500 hover:text-blue-400 opacity-0 group-hover/title:opacity-100 transition-opacity"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
                <p className="text-gray-400 text-sm mt-1">{c.last_message || "Click to view history"}</p>
              </div>
              <div className="text-gray-500 text-xs sm:text-right mt-3 sm:mt-0 flex flex-col justify-between items-end">
                {new Date(c.created_at).toLocaleDateString("en-IN")}
                {c.request_submitted && <div className="mt-2"><span className="bg-green-600/20 text-green-400 text-[10px] px-2 py-1 rounded-full font-bold">SENT</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}