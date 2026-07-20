import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext.jsx';
import './ExtensionMenu.css';

const CLASSIFICATION_LABELS = {
  work: 'Work',
  distraction: 'Distraction',
  ambiguous: 'Ambiguous',
};

export default function ExtensionMenu() {
  const {
    isMenuOpen,
    closeMenu,
    sessionActive,
    tabs,
    workTabs,
    toggleWorkTab,
    addCustomWorkTab,
    startSession,
    isDistracted,
    snooze,
  } = useSession();

  const [newTabLabel, setNewTabLabel] = useState('');

  // Clear any partially-typed tab name whenever a session starts or is reset, so it
  // never carries over into the next participant's setup.
  useEffect(() => {
    setNewTabLabel('');
  }, [sessionActive]);

  if (!isMenuOpen) {
    return null;
  }

  if (sessionActive) {
    return (
      <>
        <div className="extension-menu-backdrop" onClick={closeMenu} />

        <div className="extension-menu" role="dialog" aria-label="FlowState">
          <h2 className="extension-menu-title">FlowState</h2>
          <p className="extension-menu-prompt">
            {isDistracted
              ? 'Looks like you’ve drifted. Snooze if this one shouldn’t count.'
              : 'Session in progress. You’re on track.'}
          </p>

          <button
            type="button"
            className="extension-menu-start-button"
            onClick={() => {
              snooze();
              closeMenu();
            }}
          >
            Snooze reminders (5 min)
          </button>
        </div>
      </>
    );
  }

  function handleAddTab() {
    addCustomWorkTab(newTabLabel);
    setNewTabLabel('');
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTab();
    }
  }

  return (
    <>
      <div className="extension-menu-backdrop" onClick={closeMenu} />

      <div className="extension-menu" role="dialog" aria-label="FlowState">
        <h2 className="extension-menu-title">FlowState</h2>
        <p className="extension-menu-prompt">Choose your working tabs.</p>

        <ul className="extension-menu-list">
          {tabs.map((tab) => (
            <li className="extension-menu-item" key={tab.id}>
              <label className="extension-menu-checkbox-label">
                <input
                  type="checkbox"
                  checked={workTabs.includes(tab.id)}
                  onChange={() => toggleWorkTab(tab.id)}
                />
                <span className="extension-menu-item-name">{tab.label}</span>
              </label>
              <span className={`extension-menu-badge extension-menu-badge-${tab.classification}`}>
                {CLASSIFICATION_LABELS[tab.classification]}
              </span>
            </li>
          ))}
        </ul>

        <div className="extension-menu-add-row">
          <span className="extension-menu-add-icon" aria-hidden="true">
            +
          </span>
          <input
            type="text"
            className="extension-menu-add-input"
            placeholder="Add a work tab"
            value={newTabLabel}
            onChange={(event) => setNewTabLabel(event.target.value)}
            onKeyDown={handleInputKeyDown}
          />
        </div>

        <button type="button" className="extension-menu-start-button" onClick={startSession}>
          Let&rsquo;s start work!
        </button>
      </div>
    </>
  );
}
