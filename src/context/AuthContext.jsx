import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/auth';
import api from '../api/axios'; // ✅ needed for logout
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    setIsLoading(false);
  }, []);

  // ================= REGISTER =================
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      const data = response.data;

      console.log("REGISTER RESPONSE:", data);

      const userObj = {
        username: data.username || userData.username,
        email: data.email || userData.email,
        role: data.role || userData.role || 'client',
        phone: data.phone || userData.phone,
        id: data.user_id || data.id
      };

      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      setIsAuthenticated(true);

      // optional token handling
      const authToken =
        data.access ||
        data.token ||
        data.access_token ||
        data.key;

      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
      }

      return { success: true, role: userObj.role };

    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data);

      let errorMessage = "Registration failed";
      const backendError = error.response?.data;

      if (backendError) {
        if (backendError.username) errorMessage = backendError.username[0];
        else if (backendError.email) errorMessage = backendError.email[0];
        else if (backendError.password) errorMessage = backendError.password[0];
        else errorMessage = JSON.stringify(backendError);
      }

      return { success: false, error: errorMessage };
    }
  };

  // ================= LOGIN =================
  const login = async (username, password) => {
    try {
      const response = await loginUser({ username, password });
      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      const authToken = data.tokens?.access;
      const refreshToken = data.tokens?.refresh;

      if (!authToken) {
        return { success: false, error: 'No token received' };
      }

      // ✅ store tokens
      localStorage.setItem('token', authToken);
      localStorage.setItem('refresh', refreshToken);

      setToken(authToken);

      const userObj = {
        id: data.user?.id,
        username: data.user?.username,
        email: data.user?.email,
        role: data.user?.role,
        phone: data.user?.phone
      };

      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      setIsAuthenticated(true);

      return { success: true, role: userObj.role };

    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data);

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          'Login failed'
      };
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');

      if (refreshToken) {
        await api.post('/api/auth/logout/', {
          refresh: refreshToken
        });
      }

    } catch (error) {
      console.error("Logout API error:", error.response?.data || error);
    } finally {
      // ✅ clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);