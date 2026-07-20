import { useSession } from '../../context/SessionContext.jsx';
import './StatusIndicator.css';

function formatMMSS(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function StatusIndicator() {
  const { sessionActive, isDistracted, dwellSeconds } = useSession();

  if (!sessionActive) return null;

  return (
    <div className={`status-indicator${isDistracted ? ' status-indicator-distracted' : ''}`}>
      <span className="status-indicator-dot" aria-hidden="true" />
      <span className="status-indicator-label">FlowState is active</span>
      <span className="status-indicator-timer">{formatMMSS(dwellSeconds)}</span>
    </div>
  );
}
