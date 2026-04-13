import { initChatbox, sendChatMessage, submitRequestToPM } from "../../api/chatbot";

// Message bhejkar PM ko notify karna
export const useChatSend = (st) => {
  const send = async (text) => {
    const msg = text || st.input;
    if (!msg.trim()) return;

    st.setIsTyping(true);
    st.setView("chat");
    st.setMessages((p) => [
      ...p,
      { id: "temp-" + Date.now(), role: "user", text: msg, isLocal: true },
    ]);
    st.setInput("");

    let cid = st.chatboxId;
    if (!cid) {
      try {
        const r = await initChatbox();
        cid = r.data.id || r.data.chatbox_id;
        if (cid) {
          st.setChatboxId(cid);
          localStorage.setItem("chatboxId", cid);
        }
      } catch (e) {
        st.setIsTyping(false);
        st.setMessages((p) => [...p, { id: "e1", role: "bot", text: "⚠️ Error init" }]);
        return;
      }
    }

    try {
      const { data: d } = await sendChatMessage(cid, msg);
      if (d?.bot_reply) {
        st.setIsTyping(false);
        st.setMessages((p) => {
          const incoming = (d.bot_reply || "").trim();
          const isDupe = p.slice(-3).some(m => m.role === "bot" && (m.text || "").trim() === incoming);
          if (isDupe) return p;
          
          return [
            ...p,
            { id: "tb-" + Date.now(), role: "bot", text: d.bot_reply, isLocal: true },
          ];
        });
      }
      if (d?.all_fields_collected && !st.submitted) {
        st.setSubmitted(true);
        await submitRequestToPM(cid);
        st.setMessages((p) => [
          ...p,
          { id: "ts-" + Date.now(), role: "bot", text: "✅ Sent to PM!" },
        ]);
      }
    } catch (e) {
      st.setIsTyping(false);
      st.setMessages((p) => [...p, { id: "e2", role: "bot", text: `⚠️ Server Error` }]);
    }
  };
  return send;
};
