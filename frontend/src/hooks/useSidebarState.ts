import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sidebar_collapsed";

interface SidebarPreferences {
  /** Whether to persist sidebar state across sessions */
  persistState: boolean;
  /** Default state when persistence is disabled or no saved state exists */
  defaultCollapsed: boolean;
}

// Default preferences - will be replaced by user preferences from API in the future
const DEFAULT_PREFERENCES: SidebarPreferences = {
  persistState: true,
  defaultCollapsed: false,
};

/**
 * Hook for managing sidebar-collapsed state with localStorage persistence.
 *
 * Future integration:
 * - Accept `preferences` parameter from user settings API
 * - Example: const { isCollapsed, setIsCollapsed } = useSidebarState(userPreferences?.sidebar)
 */
export function useSidebarState(preferences?: Partial<SidebarPreferences>) {
  const config = { ...DEFAULT_PREFERENCES, ...preferences };

  const [isCollapsed, setIsCollapsedState] = useState<boolean>(() => {
    if (!config.persistState) {
      return config.defaultCollapsed;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {
      // Invalid JSON or localStorage error - use default
    }

    return config.defaultCollapsed;
  });

  // Sync to localStorage when state changes
  useEffect(() => {
    if (config.persistState) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(isCollapsed));
      } catch {
        // localStorage might be full or disabled
      }
    }
  }, [isCollapsed, config.persistState]);

  const setIsCollapsed = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setIsCollapsedState(value);
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsedState((prev) => !prev);
  }, []);

  return {
    isCollapsed,
    setIsCollapsed,
    toggle,
  };
}
