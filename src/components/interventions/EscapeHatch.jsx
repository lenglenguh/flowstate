import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from '../../context/SessionContext.jsx';
import { TAB_VIEWS } from '../../tabViews.js';
import './EscapeHatch.css';

const THRESHOLD = 0.5;

export default function EscapeHatch() {
  const {
    distractionLevel,
    isDistracted,
    returnToWork,
    escapeHatchDismissable,
    contentOverlayNode,
    workTabs,
    tabs,
  } = useSession();

  const [dismissed, setDismissed] = useState(false);
  const wasAboveRef = useRef(false);

  const isAboveThreshold = isDistracted && distractionLevel >= THRESHOLD;

  useEffect(() => {
    if (isAboveThreshold && !wasAboveRef.current) {
      setDismissed(false);
    }
    wasAboveRef.current = isAboveThreshold;
  }, [isAboveThreshold]);

  const targetTabId = workTabs[0];
  const targetTab = tabs.find((tab) => tab.id === targetTabId);
  const TargetView = TAB_VIEWS[targetTabId];

  if (!contentOverlayNode || !targetTab || !TargetView) return null;

  const visible = isAboveThreshold && !dismissed;

  function handleActivate() {
    returnToWork();
    setDismissed(true);
  }

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="escape-portal"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <div
            className="escape-portal-window"
            role="button"
            tabIndex={0}
            aria-label={`Go back to ${targetTab.label}`}
            onClick={handleActivate}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleActivate();
              }
            }}
          >
            <div className="escape-portal-canvas">
              <TargetView />
            </div>
          </div>

          {escapeHatchDismissable && (
            <button
              type="button"
              className="escape-portal-dismiss"
              aria-label="Dismiss"
              onClick={() => setDismissed(true)}
            >
              &times;
            </button>
          )}

          <span className="escape-portal-caption">&larr; Back to {targetTab.label}</span>
        </motion.div>
      )}
    </AnimatePresence>,
    contentOverlayNode
  );
}
