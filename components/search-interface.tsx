'use client'

import SearchResults from '@/components/search-results'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const THROTTLE_DELAY = 300 // milliseconds

export default function SearchInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('query') || 'magic'
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('query', searchQuery)
    else params.set('query', 'magic')
    const handleSearch = () => router.push(`?${params.toString()}`)
    const handler = setTimeout(handleSearch, THROTTLE_DELAY)
    return () => clearTimeout(handler)
  }, [searchQuery, router])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 p-6 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="default"
              value={searchQuery}
              placeholder="Search editions..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-600 bg-transparent pl-10 text-white placeholder-gray-400 focus:outline focus:outline-white"
            />
          </div>
        </div>
      </div>
      <SearchResults query={searchParams.get('query') || ''} />
    </div>
  )
}
