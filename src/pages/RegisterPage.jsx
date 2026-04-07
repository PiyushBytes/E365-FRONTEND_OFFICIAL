import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock, Music2, Mail, Phone, Eye, EyeOff } from "lucide-react";
import AuthBackground from "../components/auth/AuthBackground";
import AuthCard from "../components/auth/AuthCard";
import RoleSelector from "../components/auth/RoleSelector";
import AuthInput from "../components/auth/AuthInput";
import AuthSubmit from "../components/auth/AuthSubmit";
import { useRegisterFlow } from "../hooks/useRegisterFlow";

const ROLES = [
  { id: "client", label: "Client", icon: User, color: "text-blue-400" },
  { id: "artist", label: "Artist", icon: Music2, color: "text-red-400" },
];

export default function RegisterPage() {
  const { role, setRole, username, setUsername, email, setEmail, phone, setPhone, password, setPassword, error, isLoading, handleRegister } = useRegisterFlow();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthBackground>
      <AuthCard title="Create Account" subtitle="Join E365 and discover events">
        <form onSubmit={handleRegister} className="space-y-4">
          <RoleSelector roles={ROLES} selectedRole={role} onSelect={setRole} />
          <div className="space-y-3">
            <AuthInput icon={User} value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <AuthInput icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
            <AuthInput icon={Phone} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" />
            <AuthInput icon={Lock} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" RightAction={<button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-500 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
          </div>
          {error && <div className="text-red-400 text-xs text-center font-medium bg-red-500/10 py-2 rounded-lg">{error}</div>}
          <AuthSubmit isLoading={isLoading} text="Sign Up" />
          <div className="flex items-center justify-center text-xs text-gray-400 pt-2">
            <span>Already have an account? <Link to="/login" className="text-red-400 hover:text-red-300 font-bold ml-1">Sign In</Link></span>
          </div>
        </form>
      </AuthCard>
    </AuthBackground>
  );
}