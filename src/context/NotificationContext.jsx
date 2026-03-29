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

    // 1. Fetch historical notifications
    const fetchHistory = async () => {
      try {
        const response = await getNotificationHistory();
        setNotifications(response.data.notifications || response.data || []);
      } catch (err) {
        console.error("Failed to fetch notification history:", err);
      }
    };

    fetchHistory();

    // 2. Establish live WebSocket for notifications
    const wsBaseUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
    const userUid = user.id || user.username; // fallback to username if id not present

    if (userUid && !wsRef.current) {
        const ws = new WebSocket(`${wsBaseUrl}/notifications/${userUid}/`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                const newNotification = JSON.parse(event.data);
                console.log("Live Notification received:", newNotification);
                setNotifications(prev => [newNotification, ...prev]);
            } catch (e) {
                console.error("Error parsing notification:", e);
            }
        };

        ws.onerror = (error) => {
            console.error("Notification WebSocket error:", error);
        };
    }

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
