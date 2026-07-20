import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from '../../context/SessionContext.jsx';
import './WaitingGame.css';

const GRID_SIZE = 20;

function emptyGrid() {
  return Array(GRID_SIZE).fill(false);
}

export default function WaitingGame() {
  const { aiGenerating } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [popped, setPopped] = useState(emptyGrid);
  const wasGeneratingRef = useRef(false);

  useEffect(() => {
    if (aiGenerating && !wasGeneratingRef.current) {
      setDismissed(false);
      setPopped(emptyGrid());
    }
    wasGeneratingRef.current = aiGenerating;
  }, [aiGenerating]);

  const visible = aiGenerating && !dismissed;

  function togglePop(index) {
    setPopped((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="waiting-game"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        >
          <div className="waiting-game-inner">
            <div className="waiting-game-header">
              <span className="waiting-game-title">Gemini is thinking&hellip;</span>
              <button
                type="button"
                className="waiting-game-dismiss"
                aria-label="Dismiss"
                onClick={() => setDismissed(true)}
              >
                &times;
              </button>
            </div>

            <p className="waiting-game-subtitle">Something to do with your hands while you wait.</p>

            <div className="waiting-game-grid">
              {popped.map((isPopped, index) => (
                <motion.button
                  key={index}
                  type="button"
                  className={`waiting-game-bubble${isPopped ? ' waiting-game-bubble-popped' : ''}`}
                  aria-label={isPopped ? 'Popped bubble' : 'Unpopped bubble'}
                  onClick={() => togglePop(index)}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
