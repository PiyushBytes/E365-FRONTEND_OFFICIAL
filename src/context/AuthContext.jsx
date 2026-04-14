import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, logoutUser, getMe } from "../api/auth";
import { getArtistProfile } from "../api/artistProfile";
import { secureStorage } from "../utils/secureStorage";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = secureStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      secureStorage.removeItem("user");
      return null;
    }
  });

  const [token, setToken] = useState(() => secureStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  const persistAuth = (data) => {
    const accessToken = data?.tokens?.access;
    const refreshToken = data?.tokens?.refresh;
    const userObj = data?.user;

    if (!accessToken || !refreshToken || !userObj) {
      throw new Error("Invalid auth response from server.");
    }

    secureStorage.setItem("token", accessToken);
    secureStorage.setItem("refresh", refreshToken);
    secureStorage.setItem("user", userObj);

    setToken(accessToken);
    setUser(userObj);
  };

  const clearAuth = () => {
    secureStorage.removeItem("token");
    secureStorage.removeItem("refresh");
    secureStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = secureStorage.getItem("token");
      const storedUser = secureStorage.getItem("user");

      if (!storedToken || !storedUser) {
        clearAuth();
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMe();
        const backendUser = response?.data?.user;

        if (backendUser) {
          let finalUser = { ...backendUser };
          
          // Agar artist hai, toh check karo ki profile exist karta hai ya nahi
          if (backendUser.role === "artist") {
            try {
              await getArtistProfile();
              // Profile successfully mila — matlab profile complete hai
              finalUser.is_profile_complete = true;
            } catch {
              // Profile nahi mila (404 ya error) — matlab abhi profile nahi bana
              finalUser.is_profile_complete = false;
            }
          }
          
          secureStorage.setItem("user", finalUser);
          setUser(finalUser);
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

    const handleTokenRefreshed = (e) => {
      if (e.detail?.token) {
        setToken(e.detail.token);
      }
    };
    window.addEventListener('token_refreshed', handleTokenRefreshed);
    return () => window.removeEventListener('token_refreshed', handleTokenRefreshed);
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

      let userObj = data?.user;

      // Sync artist profile completeness properly directly after login!
      if (userObj?.role === "artist") {
        try {
          await getArtistProfile();
          userObj.is_profile_complete = true;
        } catch {
          userObj.is_profile_complete = false;
        }
      }

      data.user = userObj; // Mutate payload safely before persisting
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
      const refreshToken = secureStorage.getItem("refresh");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, token, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);