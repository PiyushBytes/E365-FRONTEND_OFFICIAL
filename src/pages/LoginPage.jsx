import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import AuthBackground from "../components/auth/AuthBackground";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import AuthSubmit from "../components/auth/AuthSubmit";
import { useLoginFlow } from "../hooks/useLoginFlow";



export default function LoginPage() {
  const { username, setUsername, password, setPassword, error, isLoading, handleLogin } = useLoginFlow();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthBackground>
      <AuthCard title="Welcome Back" subtitle="Access your dashboard" showLogo>
        <form onSubmit={handleLogin} className="space-y-5">

          <div className="space-y-4">
            <AuthInput icon={User} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <AuthInput icon={Lock} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" RightAction={<button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-500 hover:text-white transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
          </div>
          {error && <div className="text-red-400 text-xs text-center font-medium bg-red-500/10 py-2 rounded-lg">{error}</div>}
          <AuthSubmit isLoading={isLoading} text="Sign In" />
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <a href="#" className="hover:text-white">Forgot Password?</a>
            <span>Don't have an account? <Link to="/register" className="text-red-400 font-bold ml-1">Sign Up</Link></span>
          </div>
        </form>
      </AuthCard>
    </AuthBackground>
  );
}
