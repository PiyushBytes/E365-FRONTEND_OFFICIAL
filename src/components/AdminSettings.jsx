import React from "react";
import { LogOut, Save, Shield, User, Bell, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSettings = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        navigate("/");
    };

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
                <p className="text-gray-400">Manage your account preferences and system configurations.</p>
            </div>

            {/* Profile Section */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-md">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-linear-to-b from-red-600 to-red-900 p-2px rounded-full">
                            <div className="w-20 h-20 rounded-full border-4 border-black overflow-hidden">
                                <img 
                                    src="https://media.licdn.com/dms/image/v2/C4D03AQG19-4mRqhVnA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1597841155985?e=2147483647&v=beta&t=HuyZfldZIhPQfC1CEPK3ssqfsdLHZfs090jRbLsAjXk" 
                                    alt="Admin" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Kinjal Bhattacharya</h3>
                            <p className="text-gray-400">Super Admin</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10 transition-colors">
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Display Name</label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white">
                            <User size={18} className="text-gray-500" />
                            <input type="text" defaultValue="Kinjal Bhattacharya" className="bg-transparent border-none outline-none w-full text-sm" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 ml-1">Email Address</label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white">
                            <Mail size={18} className="text-gray-500" />
                            <input type="email" defaultValue="kinjal@e365.com" className="bg-transparent border-none outline-none w-full text-sm" />
                        </div>
                    </div>
                </div>
            </section>

            {/* General Settings */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield size={20} className="text-red-500" />
                    Security & Privacy
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div>
                            <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                            <p className="text-xs text-gray-400 mt-1">Add an extra layer of security to your account.</p>
                        </div>
                        <div className="w-12 h-6 bg-red-600/20 rounded-full relative cursor-pointer border border-red-600/50">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-red-600 rounded-full shadow-lg" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div>
                            <h4 className="font-medium text-white">Login Notifications</h4>
                            <p className="text-xs text-gray-400 mt-1">Get notified when someone logs in from a new device.</p>
                        </div>
                        <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer border border-white/10">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/5">
                        <Save size={18} />
                        Save Changes
                    </button>
                    <button className="px-6 py-3 text-gray-400 font-medium hover:text-white transition-colors">
                        Cancel
                    </button>
                </div>
            </section>

            {/* Logout */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-lg font-bold text-red-500 mb-4">Session Management</h3>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-gray-400">
                        Securely log out of your current session. You will be redirected to the main website home page.
                    </p>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 w-full md:w-auto justify-center"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AdminSettings;
