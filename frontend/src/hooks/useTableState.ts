import { useState, useCallback, useEffect } from "react";
import { SortingState, ColumnFiltersState, VisibilityState, PaginationState } from "@tanstack/react-table";

export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  globalFilter: string;
  rowSelection: Record<string, boolean>;
}

export interface UseTableStateOptions {
  storageKey: string;
  defaultState?: Partial<TableState>;
}

const DEFAULT_STATE: TableState = {
  sorting: [],
  columnFilters: [],
  columnVisibility: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  globalFilter: "",
  rowSelection: {},
};

export function useTableState({ storageKey, defaultState = {} }: UseTableStateOptions) {
  const getInitialState = useCallback((): TableState => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_STATE,
          ...defaultState,
          ...parsed,
          // Reset row selection on load
          rowSelection: {},
        };
      }
    } catch (error) {
      console.error("Error parsing stored table state:", error);
    }
    return { ...DEFAULT_STATE, ...defaultState };
  }, [storageKey, defaultState]);

  const [state, setState] = useState<TableState>(getInitialState);

  // Persist state to localStorage whenever it changes (except row selection)
  useEffect(() => {
    const { rowSelection: _rowSelection, ...persistableState } = state;
    try {
      localStorage.setItem(storageKey, JSON.stringify(persistableState));
    } catch (error) {
      console.error("Error saving table state:", error);
    }
  }, [state, storageKey]);

  const setSorting = useCallback((updater: SortingState | ((old: SortingState) => SortingState)) => {
    setState((prev) => ({
      ...prev,
      sorting: typeof updater === "function" ? updater(prev.sorting) : updater,
    }));
  }, []);

  const setColumnFilters = useCallback(
    (updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      setState((prev) => ({
        ...prev,
        columnFilters: typeof updater === "function" ? updater(prev.columnFilters) : updater,
      }));
    },
    []
  );

  const setColumnVisibility = useCallback(
    (updater: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
      setState((prev) => ({
        ...prev,
        columnVisibility: typeof updater === "function" ? updater(prev.columnVisibility) : updater,
      }));
    },
    []
  );

  const setPagination = useCallback(
    (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
      setState((prev) => ({
        ...prev,
        pagination: typeof updater === "function" ? updater(prev.pagination) : updater,
      }));
    },
    []
  );

  const setGlobalFilter = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      globalFilter: value,
    }));
  }, []);

  const setRowSelection = useCallback(
    (updater: Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>)) => {
      setState((prev) => ({
        ...prev,
        rowSelection: typeof updater === "function" ? updater(prev.rowSelection) : updater,
      }));
    },
    []
  );

  const resetToDefault = useCallback(() => {
    const defaultStateWithDefaults = { ...DEFAULT_STATE, ...defaultState };
    setState(defaultStateWithDefaults);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Error removing stored table state:", error);
    }
  }, [storageKey, defaultState]);

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      columnFilters: [],
      globalFilter: "",
    }));
  }, []);

  return {
    state,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setPagination,
    setGlobalFilter,
    setRowSelection,
    resetToDefault,
    resetFilters,
  };
}
