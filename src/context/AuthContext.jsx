import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, logoutUser, getMe } from "../api/auth";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  const persistAuth = (data) => {
    const accessToken = data?.tokens?.access;
    const refreshToken = data?.tokens?.refresh;
    const userObj = data?.user;

    if (!accessToken || !refreshToken || !userObj) {
      throw new Error("Invalid auth response from server.");
    }

    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh", refreshToken);
    localStorage.setItem("user", JSON.stringify(userObj));

    setToken(accessToken);
    setUser(userObj);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        clearAuth();
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMe();
        const backendUser = response?.data?.user;

        if (backendUser) {
          localStorage.setItem("user", JSON.stringify(backendUser));
          setUser(backendUser);
          setToken(storedToken);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error("Auth bootstrap failed:", error?.response?.data || error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      const data = response.data;

      if (!data?.success) {
        return {
          success: false,
          error: data?.error || data?.message || "Registration failed.",
        };
      }

      persistAuth(data);

      return {
        success: true,
        role: data?.role || data?.user?.role || "client",
      };
    } catch (error) {
      console.error("REGISTER ERROR:", error?.response?.data || error);

      const backendError = error?.response?.data;
      let errorMessage = "Registration failed.";

      if (backendError?.errors) {
        const firstKey = Object.keys(backendError.errors)[0];
        const firstValue = backendError.errors[firstKey];
        errorMessage = Array.isArray(firstValue) ? firstValue[0] : String(firstValue);
      } else if (backendError?.error) {
        errorMessage = backendError.error;
      } else if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (error?.userMessage) {
        errorMessage = error.userMessage;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const login = async (username, password) => {
    try {
      const response = await loginUser({ username, password });
      const data = response.data;

      if (!data?.success) {
        return {
          success: false,
          error: data?.error || data?.message || "Login failed.",
        };
      }

      persistAuth(data);

      return {
        success: true,
        role: data?.role || data?.user?.role || "client",
        user: data?.user,
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error?.response?.data || error);

      const backendError = error?.response?.data;

      return {
        success: false,
        error:
          backendError?.error ||
          backendError?.message ||
          backendError?.detail ||
          error?.userMessage ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error("Logout API error:", error?.response?.data || error);
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      setUser,
    }),
    [user, token, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);