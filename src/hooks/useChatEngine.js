import { useChatState } from "./chat/useChatState";
import { useChatInit } from "./chat/useChatInit";
import { useChatSend } from "./chat/useChatSend";
import { useChatWebSocket } from "./chat/useChatWebSocket";
import { useCallback } from "react";

// Primary Engine hook jismein sab include kiya gaya hai
// Ye saare chote modules ko mila ke main functional useChatEngine banata hai
export function useChatEngine() {
  const st = useChatState();
  const { setMessages, setIsTyping } = st;
  const init = useChatInit(st);
  const send = useChatSend(st);

  const handleNewMessage = useCallback((newMessage) => {
    console.log("📨 WebSocket Message Received:", newMessage);
    st.setMessages((prev) => {
      const type = newMessage.sender_type?.toLowerCase() || newMessage.sender?.toLowerCase();

      // Handle bot_card type (artist recommendations)
      if (type === "bot_card") {
        return [
          ...prev,
          {
            id: newMessage.id || "ws-" + Date.now() + Math.floor(Math.random()*100),
            role: "bot",
            text: newMessage.bot_reply || newMessage.content?.bot_reply || "Recommendations",
            time: newMessage.created_at,
            artists: newMessage.artists || newMessage.content?.artists || [],
            stage: newMessage.stage || newMessage.content?.stage || "recommending",
            botReply: newMessage.bot_reply || newMessage.content?.bot_reply,
            isCardType: true // Mark as card type
          }
        ];
      }

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
          time: newMessage.created_at,
          artists: newMessage.artists || [], // Store artists directly from message
          stage: newMessage.stage, // Store stage (e.g., "recommending")
          botReply: newMessage.bot_reply // Store bot reply
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
    chatboxId: st.chatboxId,
    queryData: st.queryData,
    init,
    send,
    reset: st.reset
  };
}
