import React from "react";
import { ChevronLeft, MessageSquare } from "lucide-react";

export default function MessagesTab({ chatboxes, selectedChatbox, setSelectedChatbox, chatMessages, setChatMessages, loadingMessages, handleSelectChatbox }) {
  if (selectedChatbox) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => { setSelectedChatbox(null); setChatMessages([]); }} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"><ChevronLeft size={18} /> Back to all chats</button>
        <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700">
          <h3 className="text-white font-bold text-lg">Chat #{selectedChatbox.id}</h3>
          <p className="text-gray-400 text-sm">{new Date(selectedChatbox.created_at).toLocaleDateString("en-IN")}</p>
        </div>
        <div className="flex flex-col gap-3">
          {loadingMessages ? <div className="text-gray-400 text-center py-10">Loading messages...</div> : chatMessages.length === 0 ? <div className="text-gray-400 text-center py-10">No messages found</div> : chatMessages.map((msg, i) => (
            <div key={i} className={`p-3 rounded-xl max-w-[75%] text-white text-sm ${msg.role === "user" ? "bg-blue-600 self-end ml-auto" : "bg-slate-700 self-start"}`}>
              {msg.text}
              {msg.time && <div className="text-xs text-gray-300 mt-1 text-right">{new Date(msg.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>}
            </div>
          ))}
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
            <button key={c.id} onClick={() => handleSelectChatbox(c)} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-5 text-left flex justify-between">
              <div><p className="text-white font-semibold">Chat #{c.id}</p><p className="text-gray-400 text-sm mt-1">{c.last_message || "Click to view"}</p></div>
              <div className="text-gray-500 text-xs text-right">{new Date(c.created_at || "2024-01-01T00:00:00Z").toLocaleDateString("en-IN")}{c.request_submitted && <div className="mt-2"><span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">✅ Request Sent</span></div>}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
