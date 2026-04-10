import { initChatbox, getChatMessages, sendChatMessage } from "../../api/chatbot";

// Messages format karke state me daalna
const format = (r, st) => {
  const raw = r.data?.results || r.data?.messages || r.data || [];
  const arr = Array.isArray(raw) ? raw : [];
  const loaded = arr.map(m => {
    const type = m.sender_type?.toLowerCase() || m.sender?.toLowerCase();
    const role = (type==="client"||type==="user") ? "user" : (type==="pm"||type==="event_manager") ? "pm" : "bot";
    return { id: m.id, role, text: m.content, username: m.sender_username, time: m.created_at };
  });
  st.setMessages(loaded);
  if (loaded.length) st.setView("chat");
};

// Agar expired hai, toh naya banakar blank msg bhejein
export const useChatInit = (st) => {
  const init = async () => {
    try {
      let id = localStorage.getItem("chatboxId") || st.chatboxId;
      if (id && id !== st.chatboxId) st.setChatboxId(id);
      
      if (!id) {
        st.setIsTyping(true);
        const r = await initChatbox();
        id = r.data.id || r.data.chatbox_id;
        if (id) {
          st.setChatboxId(id); localStorage.setItem("chatboxId", id);
          // Pehli baar blank msg bhej kar bot ko activate karein
          await sendChatMessage(id, " ");
          const msgs = await getChatMessages(id);
          format(msgs, st);
        }
        st.setIsTyping(false);
      } else {
        try {
          const r = await getChatMessages(id);
          format(r, st);
        } catch (e) {
          // Chat expire hone pe clear aur naya banane ki koshish (Recursive)
          localStorage.removeItem("chatboxId"); st.setChatboxId(null);
          st.reset();
          init(); 
        }
      }
    } catch (e) { st.setIsTyping(false); }
  }; return init;
};
