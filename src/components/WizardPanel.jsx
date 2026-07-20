import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext.jsx';
import './WizardPanel.css';

function readWizardQueryFlag() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('wizard') === 'true';
}

function useWizardVisibility() {
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'w' && event.key !== 'W') return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const target = document.activeElement;
      const isTyping =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isTyping) return;

      setToggled((prev) => !prev);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return readWizardQueryFlag() || toggled;
}

export default function WizardPanel() {
  const visible = useWizardVisibility();
  const {
    tabs,
    activeTab,
    flaggedDistractionTabs,
    flagAsDistraction,
    unflagDistraction,
    forceDistracted,
    resetEngine,
    isDistracted,
    distractionLevel,
    resetSession,
  } = useSession();

  if (!visible) return null;

  const activeTabInfo = tabs.find((tab) => tab.id === activeTab);
  const activeIsAmbiguous = activeTabInfo?.classification === 'ambiguous';
  const activeIsFlagged = flaggedDistractionTabs.includes(activeTab);
  const ambiguousTabs = tabs.filter((tab) => tab.classification === 'ambiguous');

  return (
    <div className="wizard-panel">
      <div className="wizard-panel-banner">WIZARD PANEL — FACILITATOR ONLY, NOT PARTICIPANT-FACING</div>

      <div className="wizard-panel-section">
        <p className="wizard-panel-label">
          Active tab: <strong>{activeTabInfo?.label ?? activeTab}</strong> (
          {activeTabInfo?.classification ?? 'unknown'})
        </p>
        <div className="wizard-panel-row">
          <button
            type="button"
            className="wizard-panel-button"
            disabled={!activeIsAmbiguous || activeIsFlagged}
            onClick={() => flagAsDistraction(activeTab)}
          >
            Flag as distraction
          </button>
          <button
            type="button"
            className="wizard-panel-button"
            disabled={!activeIsFlagged}
            onClick={() => unflagDistraction(activeTab)}
          >
            Un-flag
          </button>
        </div>
      </div>

      <div className="wizard-panel-section">
        <p className="wizard-panel-label">Ambiguous tabs</p>
        <ul className="wizard-panel-flag-list">
          {ambiguousTabs.map((tab) => (
            <li key={tab.id}>
              {tab.label} &mdash;{' '}
              <span className={flaggedDistractionTabs.includes(tab.id) ? 'wizard-panel-flagged' : ''}>
                {flaggedDistractionTabs.includes(tab.id) ? 'flagged as distraction' : 'clear'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="wizard-panel-section">
        <p className="wizard-panel-label">
          Manual override &mdash; isDistracted: <strong>{String(isDistracted)}</strong>, level:{' '}
          <strong>{distractionLevel.toFixed(2)}</strong>
        </p>
        <div className="wizard-panel-row">
          <button type="button" className="wizard-panel-button wizard-panel-button-danger" onClick={forceDistracted}>
            Force isDistracted
          </button>
          <button type="button" className="wizard-panel-button" onClick={resetEngine}>
            Reset override
          </button>
        </div>
      </div>

      <div className="wizard-panel-section">
        <p className="wizard-panel-label">Between participants</p>
        <button
          type="button"
          className="wizard-panel-button wizard-panel-button-danger wizard-panel-button-wide"
          onClick={resetSession}
        >
          Reset session (new participant)
        </button>
      </div>

      <p className="wizard-panel-hint">Toggle with the "w" key, or load with ?wizard=true in the URL.</p>
    </div>
  );
}
