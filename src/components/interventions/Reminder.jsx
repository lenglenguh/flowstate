import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from '../../context/SessionContext.jsx';
import './Reminder.css';

export default function Reminder() {
  const { isDistracted, returnToWork } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const wasDistractedRef = useRef(isDistracted);

  useEffect(() => {
    if (isDistracted && !wasDistractedRef.current) {
      setDismissed(false);
    }
    wasDistractedRef.current = isDistracted;
  }, [isDistracted]);

  const visible = isDistracted && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="reminder-card"
          role="alert"
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        >
          <button
            type="button"
            className="reminder-dismiss"
            aria-label="Dismiss reminder"
            onClick={() => setDismissed(true)}
          >
            &times;
          </button>

          <p className="reminder-message">
            Hey, I noticed you&rsquo;ve drifted. Shall we go back to work?
          </p>

          <button
            type="button"
            className="reminder-action"
            onClick={() => {
              returnToWork();
              setDismissed(true);
            }}
          >
            Go back to work
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
