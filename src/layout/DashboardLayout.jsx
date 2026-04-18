// Dashboard Layout — Sleek enterprise style
import React, { useState } from "react";
import DesktopSidebar from "./dashboard/DesktopSidebar";
import MobileSidebar from "./dashboard/MobileSidebar";
import DashboardHeader from "./dashboard/DashboardHeader";
import SettingsModal from "../components/common/SettingsModal";
import { AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children, menuItems, activeTab, onTabChange, user, title, notifications = [], onLogout, showSettings, setShowSettings, SettingsComponent, searchQuery, onSearchChange }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [internalSearch, setInternalSearch] = useState("");
  const currentSearch = onSearchChange ? searchQuery : internalSearch;
  const handleSearch = onSearchChange ? (e) => onSearchChange(e.target.value) : (e) => setInternalSearch(e.target.value);
  const activeLabel = menuItems.find((m) => m.id === activeTab)?.label;

  return (
    <div className="flex h-[100dvh] bg-linear-to-br from-blue-50 via-emerald-50 to-teal-50 text-slate-900 overflow-hidden">
      <DesktopSidebar isSidebarOpen={isSidebarOpen} title={title} menuItems={menuItems} activeTab={activeTab} onTabChange={onTabChange} user={user} setShowSettings={setShowSettings} onLogout={onLogout} />
      <MobileSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} title={title} menuItems={menuItems} activeTab={activeTab} onTabChange={onTabChange} setShowSettings={setShowSettings} onLogout={onLogout} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto relative bg-linear-to-br from-white/85 via-emerald-50/40 to-teal-50/40 rounded-lg m-2 ml-0 scrollbar-custom backdrop-blur-sm">
          <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeTabLabel={activeLabel} searchQuery={currentSearch} handleSearchChange={handleSearch} notifications={notifications} user={user} />
          <main className="p-4 pt-20 sm:p-6 sm:pt-24 lg:p-10 lg:pt-24">{children}</main>
        </div>
      </div>
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)}>{SettingsComponent && <SettingsComponent />}</SettingsModal>}
      </AnimatePresence>
    </div>
  );
}