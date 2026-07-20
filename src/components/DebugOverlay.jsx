import { useEffect, useState } from 'react';
import { useSession } from '../context/SessionContext.jsx';
import './DebugOverlay.css';

export default function DebugOverlay() {
  const { sessionActive, activeTab, isDistracted, dwellSeconds, distractionLevel, recentSwitchCount } =
    useSession();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== 'd' && event.key !== 'D') return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const target = document.activeElement;
      const isTyping =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isTyping) return;

      setVisible((prev) => !prev);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <div className="debug-overlay">
      <div className="debug-overlay-title">Distraction engine</div>
      <dl className="debug-overlay-list">
        <dt>sessionActive</dt>
        <dd>{String(sessionActive)}</dd>

        <dt>activeTab</dt>
        <dd>{activeTab}</dd>

        <dt>isDistracted</dt>
        <dd className={isDistracted ? 'debug-overlay-value-alert' : undefined}>
          {String(isDistracted)}
        </dd>

        <dt>dwellSeconds</dt>
        <dd>{dwellSeconds}</dd>

        <dt>distractionLevel</dt>
        <dd>{distractionLevel.toFixed(2)}</dd>

        <dt>recent switches</dt>
        <dd>{recentSwitchCount}</dd>
      </dl>
    </div>
  );
}
