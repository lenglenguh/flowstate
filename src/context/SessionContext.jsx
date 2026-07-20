import { createContext, useContext, useState } from 'react';
import { TABS } from '../tabsConfig.js';
import useDistractionEngine from '../hooks/useDistractionEngine.js';

const SessionContext = createContext(null);

function defaultWorkTabIds() {
  return TABS.filter((tab) => tab.classification === 'work').map((tab) => tab.id);
}

export function SessionProvider({ children }) {
  const [activeTab, setActiveTab] = useState('docs');
  const [tabs, setTabs] = useState(() => TABS.map((tab) => ({ ...tab })));
  const [sessionActive, setSessionActive] = useState(false);
  const [workTabs, setWorkTabs] = useState(defaultWorkTabIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((open) => !open);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleWorkTab(tabId) {
    setWorkTabs((prev) =>
      prev.includes(tabId) ? prev.filter((id) => id !== tabId) : [...prev, tabId]
    );
  }

  function addCustomWorkTab(label) {
    const trimmed = label.trim();
    if (!trimmed) return;

    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setTabs((prev) => [
      ...prev,
      { id, label: trimmed, url: null, classification: 'work', custom: true },
    ]);
    setWorkTabs((prev) => [...prev, id]);
  }

  function startSession() {
    setSessionActive(true);
    setIsMenuOpen(false);
  }

  const distraction = useDistractionEngine({ sessionActive, activeTab, tabs, workTabs });

  const value = {
    activeTab,
    setActiveTab,
    tabs,
    sessionActive,
    setSessionActive,
    workTabs,
    setWorkTabs,
    toggleWorkTab,
    addCustomWorkTab,
    isMenuOpen,
    toggleMenu,
    closeMenu,
    startSession,
    ...distraction,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
