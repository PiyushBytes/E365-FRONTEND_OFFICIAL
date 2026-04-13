import { initChatbox, getChatMessages, sendChatMessage } from "../../api/chatbot";

// Messages format karke state me daalna
const format = (r, st) => {
  const raw = r.data?.results || r.data?.messages || r.data || [];
  const arr = Array.isArray(raw) ? raw : [];
  const loaded = arr.map(m => {
    const type = m.sender_type?.toLowerCase() || m.sender?.toLowerCase();
    const role = (type === "client" || type === "user") ? "user" : (type === "pm" || type === "event_manager") ? "pm" : "bot";
    return { id: m.id, role, text: m.content, username: m.sender_username, time: m.created_at };
  }).filter((msg, index, self) => {
    if (index > 0 && self[index - 1].role === msg.role && (self[index - 1].text || "").trim() === (msg.text || "").trim()) {
      return false;
    }
    return true;
  });
  st.setMessages(loaded);
  if (loaded.length) st.setView("chat");
};

// Agar expired hai, toh naya banakar blank msg bhejein
export const useChatInit = (st) => {
  const init = async (forceNew = false, retryCount = 0) => {
    try {
      let id = forceNew ? null : (localStorage.getItem("chatboxId") || st.chatboxId);
      if (id && id !== st.chatboxId && !forceNew) st.setChatboxId(id);

      if (!id) {
        st.setIsTyping(true);
        const r = await initChatbox();
        id = r.data.id || r.data.chatbox_id;
        if (id) {
          st.setChatboxId(id); localStorage.setItem("chatboxId", id);

          let msgs = await getChatMessages(id);
          const raw = msgs?.data?.results || msgs?.data?.messages || msgs?.data || [];

          // Fallback if backend doesn't automatically trigger the first message
          if (!raw || raw.length === 0) {
            await sendChatMessage(id, " ");
            msgs = await getChatMessages(id);
          }

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
          if (retryCount < 2) {
            init(false, retryCount + 1);
          } else {
            console.error("Failed to initialize chatbox after retries.");
          }
        }
      }
    } catch (e) { st.setIsTyping(false); }
  }; return init;
};
