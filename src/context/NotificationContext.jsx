import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getNotificationHistory } from '../api/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);
  const prevCount = useRef(0);

  const playNotificationChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      
      osc.start(now);
      osc.stop(now + 0.2);

      // Second blip for a double-chime effect
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1200, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain2.gain.linearRampToValueAtTime(0, now + 0.35);

      osc2.start(now + 0.15);
      osc2.stop(now + 0.35);

    } catch (e) {
      console.warn("Audio play failed", e);
    }
  };

  useEffect(() => {
    if (notifications.length > prevCount.current && prevCount.current > 0) {
      playNotificationChime();
    }
    prevCount.current = notifications.length;
  }, [notifications]);

  // Expose fetch function so components can fetch on demand
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const response = await getNotificationHistory();
      const data = response.data.notifications || response.data || [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notification history:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isAuthenticated, user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);