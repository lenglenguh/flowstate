import { useSession } from '../context/SessionContext.jsx';
import './DebugOverlay.css';

export default function DebugOverlay() {
  const { sessionActive, activeTab, isDistracted, dwellSeconds, distractionLevel, recentSwitchCount } =
    useSession();

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
