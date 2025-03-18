import { Card, CardContent } from '@/components/ui/card'

export default function () {
  return (
    <Card className="w-full max-w-[200px] border-hidden bg-transparent">
      <CardContent className="space-y-3 px-0">
        <img className="h-[300px] w-[200px] animate-pulse bg-white/10 object-cover" />
        <h3 className="mt-2 h-6 w-[200px] animate-pulse rounded bg-white/20" />
        <p className="mt-1 h-4 w-[150px] animate-pulse rounded bg-white/20" />
        <p className="mt-1 h-4 w-[100px] animate-pulse rounded bg-white/20" />
        <p className="mt-1 h-4 w-[120px] animate-pulse rounded bg-white/20" />
      </CardContent>
    </Card>
  )
}
