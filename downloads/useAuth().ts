useAuth().login() :

src/context/AuthContext.js or equivalent

import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE = "http://127.0.0.1:8000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const response = await axios.post(
      `${API_BASE}/login/`,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data?.tokens?.access) {
      localStorage.setItem("access", data.tokens.access);
      localStorage.setItem("refresh", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }

    return data;
  };

  const logout = async () => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    try {
      if (refresh && access) {
        await axios.post(
          `${API_BASE}/logout/`,
          { refresh },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
      }
    } catch (e) {
      // ignore logout API failure
    }

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);