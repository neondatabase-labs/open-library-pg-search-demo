import { Card, CardContent } from '@/components/ui/card'

export function SearchResultSkeleton() {
  return (
    <Card className="w-full max-w-[300px] border border-gray-100">
      <CardContent className="flex flex-col p-4">
        <img className="h-[300px] w-[200px] animate-pulse bg-gray-100 object-cover" />
        <h3 className="bg-muted mt-2 h-6 w-[200px] animate-pulse rounded" />
        <p className="bg-muted mt-1 h-4 w-[150px] animate-pulse rounded" />
        <p className="bg-muted mt-1 h-4 w-[100px] animate-pulse rounded" />
        <p className="bg-muted mt-1 h-4 w-[120px] animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}
