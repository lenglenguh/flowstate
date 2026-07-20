import { createContext, useContext, useState } from 'react';
import { TABS } from '../tabsConfig.js';
import useDistractionEngine from '../hooks/useDistractionEngine.js';
import useGeminiSimulator from '../hooks/useGeminiSimulator.js';
import { sanitizeInput } from '../utils/sanitizeInput.js';

const SessionContext = createContext(null);
const MAX_TAB_LABEL_LENGTH = 40;

function defaultWorkTabIds() {
  return TABS.filter((tab) => tab.classification === 'work').map((tab) => tab.id);
}

export function SessionProvider({ children }) {
  const [activeTab, setActiveTab] = useState('docs');
  const [tabs, setTabs] = useState(() => TABS.map((tab) => ({ ...tab })));
  const [sessionActive, setSessionActive] = useState(false);
  const [workTabs, setWorkTabs] = useState(defaultWorkTabIds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [escapeHatchDismissable, setEscapeHatchDismissable] = useState(true);
  const [contentOverlayNode, setContentOverlayNode] = useState(null);
  const [flaggedDistractionTabs, setFlaggedDistractionTabs] = useState([]);
  const [sessionKey, setSessionKey] = useState(0);

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
    const trimmed = sanitizeInput(label, MAX_TAB_LABEL_LENGTH);
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

  function returnToWork() {
    if (workTabs.length > 0) {
      setActiveTab(workTabs[0]);
    }
  }

  function flagAsDistraction(tabId) {
    setFlaggedDistractionTabs((prev) => (prev.includes(tabId) ? prev : [...prev, tabId]));
  }

  function unflagDistraction(tabId) {
    setFlaggedDistractionTabs((prev) => prev.filter((id) => id !== tabId));
  }

  const distraction = useDistractionEngine({
    sessionActive,
    activeTab,
    tabs,
    workTabs,
    flaggedDistractionTabs,
  });
  const gemini = useGeminiSimulator();

  function resetSession() {
    setSessionActive(false);
    setActiveTab('docs');
    setTabs(TABS.map((tab) => ({ ...tab })));
    setWorkTabs(defaultWorkTabIds());
    setIsMenuOpen(false);
    setEscapeHatchDismissable(true);
    setFlaggedDistractionTabs([]);
    distraction.resetEngine();
    gemini.resetGemini();
    setSessionKey((key) => key + 1);
  }

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
    returnToWork,
    escapeHatchDismissable,
    setEscapeHatchDismissable,
    contentOverlayNode,
    setContentOverlayNode,
    flaggedDistractionTabs,
    flagAsDistraction,
    unflagDistraction,
    sessionKey,
    resetSession,
    ...distraction,
    ...gemini,
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
