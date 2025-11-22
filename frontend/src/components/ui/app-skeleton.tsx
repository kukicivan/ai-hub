import { Skeleton } from "./skeleton";

const STORAGE_KEY = "sidebar_collapsed";

/**
 * Reads sidebar state from localStorage synchronously.
 * This runs before React hydrates to prevent layout shift.
 */
function getSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
}

interface SidebarSkeletonProps {
  collapsed?: boolean;
}

export function SidebarSkeleton({ collapsed = false }: SidebarSkeletonProps) {
  if (collapsed) {
    return (
      <div className="w-16 border-r bg-sidebar flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-2 border-b border-sidebar-border flex justify-center">
          <Skeleton className="h-8 w-8 rounded" />
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-2 space-y-6">
          {[6, 1, 1, 1, 1, 2].map((count, sectionIndex) => (
            <div key={sectionIndex} className="space-y-1">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="flex justify-center py-2">
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer - Avatar */}
        <div className="border-t border-sidebar-border p-2 flex justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r bg-sidebar flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Status indicator */}
      <div className="px-4 py-3 bg-accent border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-hidden">
        {[
          { label: true, items: 2 },
          { label: true, items: 1 },
          { label: true, items: 1 },
          { label: true, items: 1 },
          { label: true, items: 1 },
          { label: true, items: 2 },
        ].map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <div className="px-4 mb-2">
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-1 px-2">
              {[...Array(section.items)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        {/* Pilot Program */}
        <div className="bg-accent p-3 rounded-lg mb-3">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-8 w-full rounded" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 p-2 border rounded-md">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="flex-1 overflow-auto bg-muted/30 p-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Content Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppSkeleton() {
  const isCollapsed = getSidebarCollapsed();

  return (
    <div className="flex h-screen bg-background">
      <SidebarSkeleton collapsed={isCollapsed} />
      <ContentSkeleton />
    </div>
  );
}

export default AppSkeleton;
