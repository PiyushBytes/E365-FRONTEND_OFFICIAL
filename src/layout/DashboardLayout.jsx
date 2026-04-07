// Yeh layout component dashboard ke overall structure ko decide karta hai (sidebar + content area)
import React, { useState } from "react";
import DesktopSidebar from "./dashboard/DesktopSidebar";
import MobileSidebar from "./dashboard/MobileSidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import SettingsModal from "../components/common/SettingsModal";
import { AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children, menuItems, activeTab, onTabChange, user, title, notifications = [], onLogout, showSettings, setShowSettings, SettingsComponent, searchQuery, onSearchChange }) {
  // Mobile / Desktop View handle karne ke liye sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [internalSearch, setInternalSearch] = useState("");
  
  // Agar onSearchChange diya hai bahar se to controlled search, warna internal handle hoga
  const currentSearch = onSearchChange ? searchQuery : internalSearch;
  const handleSearch = onSearchChange ? (e) => onSearchChange(e.target.value) : (e) => setInternalSearch(e.target.value);
  
  // Navbar pe dikhane ke liye dhundo kaunsa menu click ho rakha hai
  const activeLabel = menuItems.find((m) => m.id === activeTab)?.label;

  return (
    // Main container jo screen ko fix height deta hai bina scroll ke
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* PC aur Laptop screens ke liye bada Sidebar */}
      <DesktopSidebar isSidebarOpen={isSidebarOpen} title={title} menuItems={menuItems} activeTab={activeTab} onTabChange={onTabChange} user={user} setShowSettings={setShowSettings} onLogout={onLogout} />
      
      {/* Mobile users ke liye slide-in Drawer Sidebar */}
      <MobileSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} title={title} menuItems={menuItems} activeTab={activeTab} onTabChange={onTabChange} setShowSettings={setShowSettings} onLogout={onLogout} />
      
      {/* Ye right side hai jahan header aur aapke pages render honge */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Uppar wali patti (navbar tab, search bar, notifications) */}
        <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTabLabel={activeLabel} searchQuery={currentSearch} handleSearchChange={handleSearch} notifications={notifications} user={user} />
        
        {/* Main Content Area: Yahan scroll hoga aapka actual page */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">{children}</main>
      </div>
      
      {/* Settings popup modal */}
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)}>{SettingsComponent && <SettingsComponent />}</SettingsModal>}
      </AnimatePresence>
    </div>
  );
}