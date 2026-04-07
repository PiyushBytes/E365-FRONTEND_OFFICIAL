// Yeh custom hook login form ke state aur API calls ko manage karta hai
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function useLoginFlow() {
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext se login function call karne ke liye
  
  // Variables banaye login details track karne ke liye
  const [role, setRole] = useState("client");
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
      
      // Target role confirm karo redirect karne se pehle
      const targetRole = result.role || result.user?.role || role;
      
      if (["client", "artist", "admin"].includes(targetRole)) {
        navigate(`/${targetRole}`, { replace: true });
      } else {
        navigate("/", { replace: true }); // Fallback navigation
      }
    } catch (err) { 
      setError("Unexpected error."); 
    } finally { 
      setIsLoading(false); // API call khatam ho gayi
    }
  };
  
  return { role, setRole, username, setUsername, password, setPassword, error, isLoading, handleLogin };
}
