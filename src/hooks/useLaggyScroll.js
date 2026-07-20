import { useEffect, useRef } from 'react';

const EASE_AT_ZERO = 0.35;
const EASE_AT_MAX = 0.035;
const SENSITIVITY_AT_MAX = 0.3;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function useLaggyScroll(distractionLevel) {
  const containerRef = useRef(null);
  const levelRef = useRef(distractionLevel);

  useEffect(() => {
    levelRef.current = distractionLevel;
  }, [distractionLevel]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    let target = el.scrollTop;
    let frameId = null;

    function animate() {
      const current = el.scrollTop;
      const diff = target - current;
      const ease = lerp(EASE_AT_ZERO, EASE_AT_MAX, levelRef.current);

      if (Math.abs(diff) > 0.5) {
        el.scrollTop = current + diff * ease;
        frameId = requestAnimationFrame(animate);
      } else {
        el.scrollTop = target;
        frameId = null;
      }
    }

    function handleWheel(event) {
      event.preventDefault();
      const sensitivity = lerp(1, SENSITIVITY_AT_MAX, levelRef.current);
      const maxScroll = el.scrollHeight - el.clientHeight;
      target = Math.min(maxScroll, Math.max(0, target + event.deltaY * sensitivity));

      if (frameId === null) {
        frameId = requestAnimationFrame(animate);
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  return containerRef;
}
