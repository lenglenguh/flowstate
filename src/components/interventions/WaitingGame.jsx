import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from '../../context/SessionContext.jsx';
import './WaitingGame.css';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 224;
const CANVAS_HEIGHT = 140;

function emptyGrid() {
  return Array(GRID_SIZE).fill(false);
}

export default function WaitingGame() {
  const { aiGenerating } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [popped, setPopped] = useState(emptyGrid);
  const wasGeneratingRef = useRef(false);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    if (aiGenerating && !wasGeneratingRef.current) {
      setDismissed(false);
      setPopped(emptyGrid());
      clearCanvas();
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

  function getPoint(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function handlePointerDown(event) {
    isDrawingRef.current = true;
    lastPointRef.current = getPoint(event);
    canvasRef.current.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!isDrawingRef.current) return;
    const point = getPoint(event);
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = '#5f8fd6';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function handlePointerUp() {
    isDrawingRef.current = false;
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

            <div className="waiting-game-drawing">
              <div className="waiting-game-drawing-header">
                <span className="waiting-game-drawing-label">Or doodle for a bit</span>
                <button type="button" className="waiting-game-clear" onClick={clearCanvas}>
                  Clear
                </button>
              </div>
              <canvas
                ref={canvasRef}
                className="waiting-game-canvas"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
