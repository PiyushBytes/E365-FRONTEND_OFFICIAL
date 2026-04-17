import { initChatbox, getChatMessages, sendChatMessage, getQuerySummary } from "../../api/chatbot";

// Messages format karke state me daalna
const format = (r, st) => {
  const raw = r.data?.results || r.data?.messages || r.data || [];
  const arr = Array.isArray(raw) ? raw : [];
  const loaded = arr.map(m => {
    const type = m.sender_type?.toLowerCase() || m.sender?.toLowerCase();
    const role = (type === "client" || type === "user") ? "user" : (type === "pm" || type === "event_manager") ? "pm" : "bot";

    // Parse JSON content if it's a card type (artist recommendations)
    let content = m.content;
    let artists = m.artists || [];
    let stage = m.stage;
    let botReply = m.bot_reply;

    // Check if content is a JSON string with card_type
    if (typeof content === "string" && content.includes("card_type")) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.card_type === "artist_recommendations") {
          artists = parsed.artists || [];
          botReply = parsed.bot_reply || "Artist recommendations";
          stage = "recommending";
          content = botReply; // Use bot reply as the text display
        }
      } catch (e) {
        // If parse fails, keep original content
      }
    }

    return {
      id: m.id,
      role,
      text: content,
      username: m.sender_username,
      time: m.created_at,
      artists: artists,
      stage: stage,
      botReply: botReply
    };
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
  const init = async (forceNew = false) => {
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

          // Fetch and set query data
          try {
            console.log("🔍 Fetching query summary for chatboxId:", id);
            const querySummary = await getQuerySummary(id);
            console.log("✅ Query summary fetched:", querySummary?.data);
            if (querySummary?.data) st.setQueryData(querySummary.data);
          } catch (e) {
            console.log("❌ Query fetch error:", e);
          }
        }
        st.setIsTyping(false);
      } else {
        try {
          const r = await getChatMessages(id);
          format(r, st);

          // Fetch and set query data
          try {
            console.log("🔍 Fetching query summary for existing chatboxId:", id);
            const querySummary = await getQuerySummary(id);
            console.log("✅ Query summary fetched:", querySummary?.data);
            if (querySummary?.data) st.setQueryData(querySummary.data);
          } catch (e) {
            console.log("❌ Query fetch error:", e);
          }
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
