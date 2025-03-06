export function SearchResultSkeleton() {
  return (
    <div className="border rounded-lg p-4 w-full">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-[200px] bg-muted animate-pulse rounded" />
          <div className="h-3 w-[150px] bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  )
}

