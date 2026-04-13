// Yeh hook sign-up/register wale page ke logic ko sambhalta hai
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function useRegisterFlow() {
  const navigate = useNavigate();
  const { register } = useAuth(); // Auth context se register call lenge
  
  // Saare input forms ki basic fields map karke variables banaye hain
  const [role, setRole] = useState("client");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Jab user "Register" button click karta hai
  const handleRegister = async (e) => {
    e.preventDefault();
    // Safety check ki koi entry missing toh nahi
    if (!username || !email || !phone || !password) return setError("Fill all fields");
    
    setIsLoading(true); setError(""); // Loading dikhao aur purane errors hatao
    try {
      // Backend api ko complete json pack bhejte hain
      const result = await register({ username, email, phone, password, role });
      
      if (result.success) {
        const targetRole = (result.role || role).toLowerCase();
        let redirectPath = "/";

        switch (targetRole) {
          case "artist":
            redirectPath = "/artist";
            break;
          case "admin":
            redirectPath = "/admin";
            break;
          case "client":
            redirectPath = "/client";
            break;
          case "project_manager":
          case "project-manager":
          case "manager":
          case "pm":
          case "event_manager":
            redirectPath = "/event_manager";
            break;
          default:
            redirectPath = "/"; 
        }

        navigate(redirectPath, { replace: true });
      } else setError(result.error || "Registration failed.");
    } catch (err) { 
      setError("Unexpected error."); 
    } finally { 
      setIsLoading(false); 
    }
  };
  return { role, setRole, username, setUsername, email, setEmail, phone, setPhone, password, setPassword, error, isLoading, handleRegister };
}
