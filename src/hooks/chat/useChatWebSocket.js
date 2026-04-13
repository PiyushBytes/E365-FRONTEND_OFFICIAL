import { useEffect, useRef } from "react";
import { secureStorage } from "../../utils/secureStorage";
import { env } from "../../config/env";

export const useChatWebSocket = (chatboxId, onMessage, shouldConnect = true) => {
  const ws = useRef(null);
  const onMessageRef = useRef(onMessage);

  // Keep the ref updated with the latest onMessage callback
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!chatboxId || !shouldConnect) return;

    const token = secureStorage.getItem("token");
    if (!token) return;

    // Build the WebSocket URL based on API base URL
    let wsBaseUrl = env.API_URL || "http://localhost:8000";
    wsBaseUrl = wsBaseUrl.replace(/^http/, "ws");
    
    const wsUrl = `${wsBaseUrl}/ws/chat/${chatboxId}/?token=${token}`;

    console.log(`[WebSocket] Connecting to ${wsUrl}`);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log(`[WebSocket] Opened for chatbox: ${chatboxId}`);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "new_message") {
          if (onMessageRef.current) onMessageRef.current(data);
        } else if (data.event === "em_entered" || data.event === "pm_joined" || data.type === "em_entered" || data.type === "pm_joined") {
          const pmName = data.pm_name || data.username || data.sender_username || "Project Manager";
          if (onMessageRef.current) onMessageRef.current({
            id: "sys-" + Date.now(),
            sender_type: "system",
            content: `[Project Manager] (${pmName}) has joined the chat and typing for your smooth solution`,
            created_at: new Date().toISOString()
          });
        } else if (data.event === "em_exited" || data.event === "pm_left" || data.type === "em_exited" || data.type === "pm_left") {
          const pmName = data.pm_name || data.username || data.sender_username || "Project Manager";
          if (onMessageRef.current) onMessageRef.current({
            id: "sys-" + Date.now() + "-left",
            sender_type: "system",
            content: `[Project Manager] (${pmName}) has left the chat. I'll continue assisting you.`,
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("[WebSocket] Parse error:", err);
      }
    };

    ws.current.onerror = (err) => {
      console.error("[WebSocket] Error for chatbox:", chatboxId, err);
    };

    ws.current.onclose = () => {
      console.log(`[WebSocket] Closed for chatbox: ${chatboxId}`);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [chatboxId, shouldConnect]);

  return ws;
};
