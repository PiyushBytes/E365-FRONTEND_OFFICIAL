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
      console.log("🔍 API Response:", d); // Debug

      // Handle bot_card type (artist recommendations)
      if (d?.sender_type?.toLowerCase() === "bot_card" || d?.artists?.length > 0) {
        st.setIsTyping(false);
        st.setMessages((p) => {
          // For bot_card, always add it (don't check for dupes)
          console.log("✅ Storing bot_card with artists:", d.artists?.length || 0, "artists");
          return [
            ...p,
            {
              id: "tb-" + Date.now(),
              role: "bot",
              text: d.bot_reply || "Recommendations",
              isLocal: true,
              artists: d.artists || [],
              stage: d.stage || "recommending",
              botReply: d.bot_reply,
              isCardType: true // Mark as card type
            },
          ];
        });
        return;
      }

      if (d?.bot_reply) {
        st.setIsTyping(false);
        st.setMessages((p) => {
          const incoming = (d.bot_reply || "").trim();
          // Check for duplicate
          const dupeIndex = p.slice(-3).findIndex(m => m.role === "bot" && (m.text || "").trim() === incoming);

          if (dupeIndex !== -1) {
            // Found a duplicate - UPDATE it with artists instead of skipping
            const updated = [...p];
            const actualIndex = p.length - 3 + dupeIndex;
            updated[actualIndex] = {
              ...updated[actualIndex],
              artists: d.artists || [],
              stage: d.stage,
              botReply: d.bot_reply
            };
            console.log("✅ Updated existing message with artists:", d.artists?.length || 0, "artists");
            return updated;
          }

          // No duplicate - add new message
          console.log("✅ Storing new message with artists:", d.artists?.length || 0, "artists");
          return [
            ...p,
            {
              id: "tb-" + Date.now(),
              role: "bot",
              text: d.bot_reply,
              isLocal: true,
              artists: d.artists || [], // Store artists from response
              stage: d.stage, // Store stage
              botReply: d.bot_reply // Store full bot reply
            },
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
