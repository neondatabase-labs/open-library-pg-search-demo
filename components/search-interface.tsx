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
  const initialQuery = searchParams.get('query') || 'Thrones'
  const initialOffset = Number(searchParams.get('offset')) || 0
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [offset, setOffset] = useState(initialOffset)

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('query', searchQuery)
    else params.set('query', 'Thrones')
    params.set('offset', offset.toString())
    const handleSearch = () => router.push(`?${params.toString()}`)
    const handler = setTimeout(handleSearch, THROTTLE_DELAY)
    return () => clearTimeout(handler)
  }, [searchQuery, offset, router])

  return (
    <>
      <div className="relative mt-4 flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="default"
          value={searchQuery}
          placeholder="Search editions..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-gray-600 bg-transparent pl-10 text-white placeholder-gray-400 focus:outline focus:outline-white"
        />
      </div>
      <SearchResults query={searchParams.get('query') || ''} offset={offset} setOffset={setOffset} />
    </>
  )
}
