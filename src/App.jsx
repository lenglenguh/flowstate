import { SessionProvider, useSession } from './context/SessionContext.jsx';
import BrowserChrome from './components/BrowserChrome.jsx';
import DebugOverlay from './components/DebugOverlay.jsx';
import DocsView from './components/tabs/DocsView.jsx';
import GeminiView from './components/tabs/GeminiView.jsx';
import InstagramView from './components/tabs/InstagramView.jsx';
import YouTubeView from './components/tabs/YouTubeView.jsx';
import './App.css';

const TAB_VIEWS = {
  docs: DocsView,
  gemini: GeminiView,
  instagram: InstagramView,
  youtube: YouTubeView,
};

function BrowserWindow() {
  const { activeTab, distractionLevel } = useSession();
  const ActiveView = TAB_VIEWS[activeTab] ?? DocsView;

  const contentStyle = {
    filter: `grayscale(${distractionLevel}) brightness(${1 - distractionLevel * 0.15})`,
  };

  return (
    <div className="browser-window">
      <BrowserChrome />
      <div className="browser-content" style={contentStyle}>
        <ActiveView />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserWindow />
      <DebugOverlay />
    </SessionProvider>
  );
}
