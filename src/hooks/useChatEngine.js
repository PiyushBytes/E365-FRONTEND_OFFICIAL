import { useChatState } from "./chat/useChatState";
import { useChatInit } from "./chat/useChatInit";
import { useChatSend } from "./chat/useChatSend";
import { useChatWebSocket } from "./chat/useChatWebSocket";
import { useCallback } from "react";

// Primary Engine hook jismein sab include kiya gaya hai
// Ye saare chote modules ko mila ke main functional useChatEngine banata hai
export function useChatEngine() {
  const st = useChatState();
  const init = useChatInit(st);
  const send = useChatSend(st);

  const handleNewMessage = useCallback((newMessage) => {
    st.setMessages((prev) => {
      const type = newMessage.sender_type?.toLowerCase() || newMessage.sender?.toLowerCase();
      const role = (type === "client" || type === "user") ? "user" : (type === "pm" || type === "event_manager") ? "pm" : "bot";
      const incomingText = (newMessage.content || newMessage.text || "").trim();
      
      // Deduplicate optimistic messages
      const isDupe = prev.slice(-3).some(m => m.role === role && ((m.text || "").trim() === incomingText || (m.content || "").trim() === incomingText));
      if (isDupe) return prev;

      return [
        ...prev,
        {
          id: newMessage.id || "ws-" + Date.now() + Math.floor(Math.random()*100),
          role: role,
          text: incomingText,
          time: newMessage.created_at
        }
      ];
    });
    
    st.setIsTyping(false); // Stop typing indicator whenever a new message organically arrives
  }, [st.setMessages, st.setIsTyping]);

  const shouldConnectWS = Boolean(st.chatboxId && st.view === "chat");
  useChatWebSocket(st.chatboxId, handleNewMessage, shouldConnectWS);

  return { 
    input: st.input, 
    setInput: st.setInput, 
    isTyping: st.isTyping, 
    messages: st.messages, 
    view: st.view, 
    scrollRef: st.scrollRef, 
    init, 
    send, 
    reset: st.reset 
  };
}
