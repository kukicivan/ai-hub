import { Skeleton } from "./skeleton";

interface InboxSkeletonProps {
  count?: number;
}

export function MessageListSkeleton({ count = 5 }: InboxSkeletonProps) {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex justify-between items-center pt-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Sentiment Grid */}
        <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded-lg space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Actions */}
        <div className="bg-white p-4 rounded-lg space-y-3">
          <Skeleton className="h-5 w-20" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <Skeleton className="h-4 w-4 rounded-full mt-1" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InboxStatsSkeleton() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Skeleton className="h-7 w-16 rounded" />
      <Skeleton className="h-7 w-24 rounded" />
      <Skeleton className="h-7 w-28 rounded" />
      <Skeleton className="h-7 w-24 rounded" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 10, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardSkeleton />
        </div>
        <div>
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export default MessageListSkeleton;
