import { useChatState } from "./chat/useChatState";
import { useChatInit } from "./chat/useChatInit";
import { useChatSend } from "./chat/useChatSend";

// Primary Engine hook jismein sab include kiya gaya hai
// Ye saare chote modules ko mila ke main functional useChatEngine banata hai
export function useChatEngine() {
  const st = useChatState();
  const init = useChatInit(st);
  const send = useChatSend(st);

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
