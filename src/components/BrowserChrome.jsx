import { useSession } from '../context/SessionContext.jsx';
import { TABS } from '../tabsConfig.js';
import ExtensionMenu from './ExtensionMenu.jsx';
import './BrowserChrome.css';

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 10V8a6 6 0 1 1 12 0v2M5 10h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExtensionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2a2 2 0 0 1 2 2v1.5h2A2.5 2.5 0 0 1 18.5 8v2H20a2 2 0 1 1 0 4h-1.5v2A2.5 2.5 0 0 1 16 18.5h-2V20a2 2 0 1 1-4 0v-1.5H8A2.5 2.5 0 0 1 5.5 16v-2H4a2 2 0 1 1 0-4h1.5V8A2.5 2.5 0 0 1 8 5.5h2V4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BrowserChrome() {
  const { activeTab, setActiveTab, isMenuOpen, toggleMenu } = useSession();
  const current = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  return (
    <div className="browser-chrome">
      <div className="tab-row">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab${tab.id === activeTab ? ' tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-favicon" aria-hidden="true" />
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="toolbar-row">
        <div className="nav-buttons">
          <button type="button" className="nav-button" disabled aria-label="Back">
            &#8592;
          </button>
          <button type="button" className="nav-button" disabled aria-label="Forward">
            &#8594;
          </button>
          <button type="button" className="nav-button" disabled aria-label="Reload">
            &#8635;
          </button>
        </div>

        <div className="address-bar">
          <LockIcon />
          <span className="address-text">{current.url}</span>
        </div>

        <button
          type="button"
          className={`extension-button${isMenuOpen ? ' extension-button-active' : ''}`}
          aria-label="FlowState extension"
          aria-expanded={isMenuOpen}
          title="FlowState"
          onClick={toggleMenu}
        >
          <ExtensionIcon />
        </button>
      </div>

      <ExtensionMenu />
    </div>
  );
}
