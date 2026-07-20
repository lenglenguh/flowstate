import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RAMP_DURATION_MS = 60000;
const SWITCH_LOG_WINDOW_MS = 5 * 60000;
const SWITCH_FREQUENCY_WINDOW_MS = 60000;

export default function useDistractionEngine({ sessionActive, activeTab, tabs, workTabs }) {
  const [dwellSeconds, setDwellSeconds] = useState(0);
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionLevel, setDistractionLevel] = useState(0);
  const [switchLog, setSwitchLog] = useState([]);
  const [snoozedUntil, setSnoozedUntil] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());

  const previousTabRef = useRef(activeTab);
  const distractionStartRef = useRef(null);

  const isWorkTab = useCallback((tabId) => workTabs.includes(tabId), [workTabs]);

  const isDistractionTab = useCallback(
    (tabId) => {
      if (isWorkTab(tabId)) return false;
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) return false;
      // Ambiguous tabs only count once flagged as distraction, which arrives in Phase 5.
      return tab.classification === 'distraction';
    },
    [tabs, isWorkTab]
  );

  function snooze(durationMinutes = 5) {
    setSnoozedUntil(Date.now() + durationMinutes * 60000);
  }

  // Record every tab change during a session for switch-frequency analysis.
  useEffect(() => {
    if (!sessionActive) {
      previousTabRef.current = activeTab;
      return;
    }
    if (previousTabRef.current !== activeTab) {
      const entry = { at: Date.now(), from: previousTabRef.current, to: activeTab };
      previousTabRef.current = activeTab;
      setSwitchLog((prev) => {
        const cutoff = Date.now() - SWITCH_LOG_WINDOW_MS;
        return [...prev, entry].filter((item) => item.at >= cutoff);
      });
    }
  }, [activeTab, sessionActive]);

  // Evaluate distraction status whenever the active tab, session, or snooze state changes.
  useEffect(() => {
    if (!sessionActive) {
      setIsDistracted(false);
      setDwellSeconds(0);
      distractionStartRef.current = null;
      return;
    }

    const snoozed = snoozedUntil !== null && Date.now() < snoozedUntil;

    if (snoozed || isWorkTab(activeTab)) {
      setIsDistracted(false);
      setDwellSeconds(0);
      distractionStartRef.current = null;
      return;
    }

    if (isDistractionTab(activeTab)) {
      setIsDistracted(true);
      if (distractionStartRef.current === null) {
        distractionStartRef.current = Date.now();
      }
    } else {
      // Unflagged ambiguous tab: neither work nor distraction, dwell just pauses.
      setIsDistracted(false);
      distractionStartRef.current = null;
    }
  }, [activeTab, sessionActive, snoozedUntil, isWorkTab, isDistractionTab]);

  // One-second heartbeat drives dwell counting and keeps the switch-frequency window fresh.
  useEffect(() => {
    if (!sessionActive) return undefined;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [sessionActive]);

  useEffect(() => {
    if (isDistracted) {
      setDwellSeconds((seconds) => seconds + 1);
    }
  }, [nowTick]); // eslint-disable-line react-hooks/exhaustive-deps

  // Smooth ramp of distractionLevel toward 1.0 over ~60s, restarting from 0 on each fresh landing.
  useEffect(() => {
    if (!sessionActive || !isDistracted) {
      setDistractionLevel(0);
      return undefined;
    }

    let frameId;
    const tick = () => {
      const start = distractionStartRef.current ?? Date.now();
      const level = Math.min(1, (Date.now() - start) / RAMP_DURATION_MS);
      setDistractionLevel(level);
      if (level < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [sessionActive, isDistracted]);

  const recentSwitchCount = useMemo(() => {
    const cutoff = Date.now() - SWITCH_FREQUENCY_WINDOW_MS;
    return switchLog.filter((entry) => entry.at >= cutoff && isWorkTab(entry.from) && !isWorkTab(entry.to))
      .length;
  }, [switchLog, nowTick, isWorkTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSnoozed = snoozedUntil !== null && nowTick < snoozedUntil;

  return {
    dwellSeconds,
    isDistracted,
    distractionLevel,
    switchLog,
    recentSwitchCount,
    isSnoozed,
    snooze,
  };
}
