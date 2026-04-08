import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getNotificationHistory } from '../api/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    // 1. Fetch historical notifications (Works fine with Gunicorn)
    const fetchHistory = async () => {
      try {
        const response = await getNotificationHistory();
        const data = response.data.notifications || response.data || [];
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch notification history:", err);
      }
    };

    fetchHistory();

    // 2. Live WebSocket (DISABLED FOR DEMO TO PREVENT CONSOLE ERRORS)
    /*
    const connectWS = () => {
      const wsBaseUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
      const userUid = user.id || user.username;
      if (userUid && !wsRef.current) {
        const ws = new WebSocket(`${wsBaseUrl}/notifications/${userUid}/`);
        wsRef.current = ws;
        ws.onmessage = (event) => {
          try {
            const newNotification = JSON.parse(event.data);
            setNotifications(prev => [newNotification, ...prev]);
          } catch (e) { console.error(e); }
        };
        ws.onclose = () => { wsRef.current = null; };
      }
    };
    connectWS(); 
    */

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isAuthenticated, user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);