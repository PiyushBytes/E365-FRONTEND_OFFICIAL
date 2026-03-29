import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To check initial auth state
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists on mount and maybe validate it?
    // For now, if we have a token, we assume logged in. 
    // Ideally we'd hit a /me endpoint or similar to validate and get user details.
    if (token) {
      setIsAuthenticated(true);
      // Optional: decode token to get user role/id if not stored separately
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
    setIsLoading(false);
  }, [token]);

  const register = async (userData) => {
    try {
      // POST /api/auth/register/ -> get tokens
      const response = await registerUser(userData);
      
      const { access, refresh, role, user_id, ...restData } = response.data;
      const authToken = access || response.data.token || response.data.access_token || response.data.key;
      
      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
        
        const userObj = { role: role || userData.role || 'client', id: user_id, ...userData, ...restData };
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        setIsAuthenticated(true);
        
        return { success: true, role: userObj.role };
      } else {
         return { success: false, error: 'No token received during registration' };
      }
    } catch (error) {
      console.error("Registration failed", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const login = async (username, password) => {
    try {
      const response = await loginUser({ username, password });
      
      console.log("Full Login Response:", response);
      console.log("Response Data:", response.data);

      // Adjust based on actual API response
      const { access, refresh, role, user_id, ...userData } = response.data;
      
      // If the API returns 'access' as the token
      const authToken = access || response.data.token || response.data.access_token || response.data.key;
      
      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
        
        // Construct user object
        const userObj = { username, role: role || 'client', id: user_id, ...userData };
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
        setIsAuthenticated(true);
        
        return { success: true, role: userObj.role };
      } else {
         return { success: false, error: 'No token received' };
      }

    } catch (error) {
      console.error("Login failed", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await api.post('/auth/logout/'); 
    } catch (error) {
       console.error("Logout failed", error);
    } finally {
      // Always clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
