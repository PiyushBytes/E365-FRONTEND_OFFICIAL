import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { initChatbox, sendChatMessage, getChatMessages, submitRequestToPM } from "../api/chatbot";
import { useAuth } from "../context/AuthContext";

const ChatWidget = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatboxId, setChatboxId] = useState(
    localStorage.getItem("chatboxId") || null
  );
  const [messages, setMessages] = useState([]);
  const [requestSubmitted, setRequestSubmitted] = useState(false); // ✅ NEW

  const scrollRef = useRef(null);
  const { user } = useAuth();

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  // auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ✅ Create OR load existing chatbox
  useEffect(() => {
    if (!open) return;

    const setupChatbox = async () => {
      try {
        let currentId = chatboxId;

        if (!currentId) {
          setIsTyping(true);
          const res = await initChatbox();
          currentId = res.data.id || res.data.chatbox_id;

          if (currentId) {
            setChatboxId(currentId);
            localStorage.setItem("chatboxId", currentId);
          }
          setIsTyping(false);
        } else {
          // ✅ Load previous messages if chatbox already exists
          try {
            const res = await getChatMessages(currentId);
            const loadedMessages = res.data.map((msg) => ({
              role: msg.sender === "user" ? "user" : "bot",
              text: msg.content,
            }));
            setMessages(loadedMessages);
          } catch (err) {
            console.error("Failed to load messages:", err);
          }
        }
      } catch (err) {
        console.error("Chat init error:", err);
        setIsTyping(false);
      }
    };

    setupChatbox();
  }, [open]);

  // ================= SEND MESSAGE =================
  const fetchBotReply = async (userMessage) => {
    if (!chatboxId) return;

    try {
      const res = await sendChatMessage(chatboxId, userMessage);
      const data = res.data;

      setIsTyping(false);

      // Bot reply
      if (data?.bot_reply) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.bot_reply },
        ]);
      }

      // Missing fields
      if (data?.missing_fields?.length) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Please provide: " + data.missing_fields.join(", "),
          },
        ]);
      }

      // ✅ Saari details mil gayi → PM ko request submit karo
      if (
        data?.all_fields_collected === true &&
        !requestSubmitted
      ) {
        setRequestSubmitted(true);
        try {
          await submitRequestToPM(chatboxId);
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: "✅ Your request has been sent to our Project Manager! You can track it in the Messages section.",
            },
          ]);
        } catch (err) {
          console.error("Failed to submit request to PM:", err);
        }
      }

    } catch (error) {
      setIsTyping(false);
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Please try again." },
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    fetchBotReply(userMsg.text);
  };

  // ✅ New chat → reset everything
  const handleNewChat = () => {
    setChatboxId(null);
    localStorage.removeItem("chatboxId");
    setMessages([]);
    setRequestSubmitted(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {open && (
        <div className="w-80 h-[500px] bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4">

          {/* HEADER */}
          <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between">
            <span className="text-white font-bold">E365 Assistant</span>
            <div className="flex gap-3">
              <button onClick={handleNewChat} className="text-white">+</button>
              <button onClick={() => setOpen(false)} className="text-white">✕</button>
            </div>
          </div>

          {/* CHAT BODY */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-900"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-slate-700 text-white self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="text-gray-400 text-sm">Typing...</div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              className="flex-1 p-2 rounded bg-slate-900 text-white"
            />
            <button onClick={handleSend} className="ml-2 text-blue-400">
              ➤
            </button>
          </div>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-white px-4 py-2 rounded-full shadow"
      >
        💬 Chat
      </button>
    </div>
  );
});

export default ChatWidget;