import { SessionProvider, useSession } from './context/SessionContext.jsx';
import BrowserChrome from './components/BrowserChrome.jsx';
import DebugOverlay from './components/DebugOverlay.jsx';
import WizardPanel from './components/WizardPanel.jsx';
import Reminder from './components/interventions/Reminder.jsx';
import EscapeHatch from './components/interventions/EscapeHatch.jsx';
import StatusIndicator from './components/interventions/StatusIndicator.jsx';
import { TAB_VIEWS } from './tabViews.js';
import './App.css';

function BrowserWindow() {
  const { activeTab, distractionLevel, setContentOverlayNode, sessionKey } = useSession();
  const ActiveView = TAB_VIEWS[activeTab] ?? TAB_VIEWS.docs;

  const contentStyle = {
    filter: `grayscale(${distractionLevel}) brightness(${1 - distractionLevel * 0.15})`,
  };

  return (
    <div className="browser-window">
      <BrowserChrome />
      <StatusIndicator />
      <div className="content-stage">
        <div className="browser-content" style={contentStyle}>
          {/* Keyed on sessionKey so a "reset session" always forces a clean remount, even
              when the active tab happens not to change (e.g. still on Docs). */}
          <ActiveView key={sessionKey} />
        </div>
        <div className="content-overlay-root" ref={setContentOverlayNode} />
      </div>
      <Reminder />
      <EscapeHatch />
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserWindow />
      <DebugOverlay />
      <WizardPanel />
    </SessionProvider>
  );
}
