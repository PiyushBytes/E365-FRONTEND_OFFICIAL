// Dashboard ka main layout — sidebar + header + content area
import React, { useState } from "react";
import DesktopSidebar from "./dashboard/DesktopSidebar";
import MobileSidebar from "./dashboard/MobileSidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import SettingsModal from "../components/common/SettingsModal";
import { AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children, menuItems, activeTab, onTabChange, user, title, notifications = [], onLogout, showSettings, setShowSettings, SettingsComponent, searchQuery, onSearchChange }) {
  // Sidebar toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [internalSearch, setInternalSearch] = useState("");
  const currentSearch = onSearchChange ? searchQuery : internalSearch;
  const handleSearch = onSearchChange ? (e) => onSearchChange(e.target.value) : (e) => setInternalSearch(e.target.value);
  const activeLabel = menuItems.find((m) => m.id === activeTab)?.label;

  return (
    <div className="flex h-[100dvh] bg-black text-white overflow-hidden">
      {/* Desktop sidebar — bade screens ke liye */}
      <DesktopSidebar isSidebarOpen={isSidebarOpen} title={title} menuItems={menuItems} activeTab={activeTab} onTabChange={onTabChange} user={user} setShowSettings={setShowSettings} onLogout={onLogout} />
      {/* Mobile drawer sidebar */}
      <MobileSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} title={title} menuItems={menuItems} activeTab={activeTab} onTabChange={onTabChange} setShowSettings={setShowSettings} onLogout={onLogout} />
      {/* Content area — header + scrollable main */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTabLabel={activeLabel} searchQuery={currentSearch} handleSearchChange={handleSearch} notifications={notifications} user={user} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-10 scrollbar-hide">{children}</main>
      </div>
      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)}>{SettingsComponent && <SettingsComponent />}</SettingsModal>}
      </AnimatePresence>
    </div>
  );
}