import React from "react";
import { PMChatLayout } from "./chat/PMChatLayout";
import { PMChatHeader } from "./chat/PMChatHeader";
import { PMChatMessageList } from "./chat/PMChatMessageList";
import { PMChatFooter } from "./chat/PMChatFooter";
import { usePMChat } from "../../hooks/projectManager/usePMChat";

// Project Manager ka modal, jaha saare 50-lines ke tukde jode gaye hain
const PMChatModal = ({ notification, onClose }) => {
  const { 
    messages, input, setInput, isTyping, loading, 
    hasJoined, scrollRef, join, leave, send, setMessages 
  } = usePMChat(notification.id);
  
  const cName = notification.client_name || "Client";

  // Modal band karte time agar joined hai to chatbox se exit karo
  const handleClose = () => {
    leave();
    onClose();
  };

  const handleRefresh = () => setMessages([]); // Clear locally

  return (
    <PMChatLayout>
      <PMChatHeader clientName={cName} onRefresh={handleRefresh} onClose={handleClose} />
      
      <div className="flex-1 overflow-y-auto scrollbar-hide w-full flex flex-col">
        <PMChatMessageList 
           loading={loading} messages={messages} 
           scrollRef={scrollRef} clientName={cName} isTyping={isTyping} 
        />
      </div>

      <PMChatFooter 
        hasJoined={hasJoined} onJoin={join} 
        input={input} setInput={setInput} onSend={send} 
        activeInput={input.trim() && !isTyping} 
      />
    </PMChatLayout>
  );
};

export default PMChatModal;