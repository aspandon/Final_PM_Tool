// js/hooks/useAutoRefresh.js

/**
 * useAutoRefresh Hook
 * Automatically refreshes data at specified intervals
 */

const { useEffect } = React;

export function useAutoRefresh(refreshFunction, intervalMs = 45000, dependencies = []) {
  useEffect(() => {
    if (!refreshFunction) return;

    const timer = setInterval(() => {
      refreshFunction();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [refreshFunction, intervalMs, ...dependencies]);
}
