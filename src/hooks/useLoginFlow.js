// Yeh custom hook login form ke state aur API calls ko manage karta hai
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function useLoginFlow() {
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext se login function call karne ke liye

  // Variables banaye login details track karne ke liye

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Jab user submit karta hai tab yeh trigger hoga
  const handleLogin = async (e) => {
    e.preventDefault(); // Page reload hone se block karo

    // Authentication safety check
    if (!username.trim() || !password.trim()) return setError("Enter credentials");

    setIsLoading(true); setError(""); // Loading state chalu karo
    try {
      // Backend ko call karo parameters bhej ke
      const result = await login(username.trim(), password);

      // Agar login fail ho jaye
      if (!result.success) return setError(result.error || "Login failed.");

      // Login done ke baad, user ka role jo bhi ho, use hamesha main landing page par bhejo
      navigate("/", { replace: true });
    } catch (err) {
      setError("Unexpected error.");
    } finally {
      setIsLoading(false); // API call khatam ho gayi
    }
  };

  return { username, setUsername, password, setPassword, error, isLoading, handleLogin };
}
