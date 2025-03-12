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

  const initialQuery = searchParams.get('query') || ''
  const initialTable = searchParams.get('table') || 'editions'

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedTable, setSelectedTable] = useState(initialTable)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('query', searchQuery)
    params.set('table', selectedTable)
    const handleSearch = () => {
      setIsSearching(true)
      router.push(`?${params.toString()}`)
      setTimeout(() => setIsSearching(false), 100)
    }
    const handler = setTimeout(handleSearch, THROTTLE_DELAY)
    return () => clearTimeout(handler)
  }, [searchQuery, selectedTable, router])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 p-6 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input type="default" className="pl-10" value={searchQuery} placeholder="Search database..." onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      </div>
      <SearchResults query={searchParams.get('query') || ''} table={searchParams.get('table') || 'authors'} />
    </div>
  )
}
