import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const RAMP_DURATION_MS = 60000;
const SWITCH_LOG_WINDOW_MS = 5 * 60000;
const SWITCH_FREQUENCY_WINDOW_MS = 60000;

export default function useDistractionEngine({
  sessionActive,
  activeTab,
  tabs,
  workTabs,
  flaggedDistractionTabs,
}) {
  const [dwellSeconds, setDwellSeconds] = useState(0);
  const [isDistracted, setIsDistracted] = useState(false);
  const [distractionLevel, setDistractionLevel] = useState(0);
  const [switchLog, setSwitchLog] = useState([]);
  const [snoozedUntil, setSnoozedUntil] = useState(null);
  const [override, setOverride] = useState(null); // null | true | false, set by the wizard panel
  const [nowTick, setNowTick] = useState(Date.now());

  const previousTabRef = useRef(activeTab);
  const distractionStartRef = useRef(null);

  const isWorkTab = useCallback((tabId) => workTabs.includes(tabId), [workTabs]);

  const isDistractionTab = useCallback(
    (tabId) => {
      if (isWorkTab(tabId)) return false;
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) return false;
      if (tab.classification === 'distraction') return true;
      // Ambiguous tabs only count once the wizard panel flags them as a distraction.
      return tab.classification === 'ambiguous' && flaggedDistractionTabs.includes(tabId);
    },
    [tabs, flaggedDistractionTabs, isWorkTab]
  );

  function snooze(durationMinutes = 5) {
    setSnoozedUntil(Date.now() + durationMinutes * 60000);
  }

  function forceDistracted() {
    setOverride(true);
  }

  function resetEngine() {
    setOverride(null);
    setIsDistracted(false);
    setDwellSeconds(0);
    setDistractionLevel(0);
    setSnoozedUntil(null);
    setSwitchLog([]);
    distractionStartRef.current = null;
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

    if (override !== null) {
      if (override) {
        setIsDistracted(true);
        if (distractionStartRef.current === null) {
          distractionStartRef.current = Date.now();
        }
      } else {
        setIsDistracted(false);
        setDwellSeconds(0);
        distractionStartRef.current = null;
      }
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
    // nowTick is intentionally included so a snooze naturally expiring is re-checked every
    // second, instead of only re-evaluating on the next tab switch.
  }, [activeTab, sessionActive, snoozedUntil, override, nowTick, isWorkTab, isDistractionTab]);

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
    forceDistracted,
    resetEngine,
  };
}
