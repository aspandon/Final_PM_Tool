// js/hooks/useFilters.js

/**
 * useFilters Hook
 * Manages filter state for data filtering
 */

const { useState, useCallback, useMemo } = React;

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null && v !== undefined && v !== '');
      }
      return false;
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters
  };
}
