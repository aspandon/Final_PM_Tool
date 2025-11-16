// js/hooks/useAutoSave.js

/**
 * useAutoSave Hook
 * Automatically saves data at specified intervals
 */

const { useEffect } = React;

export function useAutoSave(data, saveFunction, intervalMs = 45000) {
  useEffect(() => {
    if (!data || !saveFunction) return;

    const timer = setInterval(() => {
      saveFunction(data);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [data, saveFunction, intervalMs]);
}
