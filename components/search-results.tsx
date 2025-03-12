'use client'

import { SearchResultSkeleton } from '@/components/search-result-skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

type SearchResult = {
  id: string | number
  [key: string]: any
}

export default function SearchResults({ query, table }: { query: string; table: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [offset, setOffset] = useState(0) // State variable for pagination
  const [rowsTotal, setRowsTotal] = useState<string | number>('0') // State variable for total rows
  const [searchTime, setSearchTime] = useState<string | number>('0') // State variable for search time

  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      setError(null)
      if (!query) {
        setResults([])
        setLoading(false)
        setRowsTotal('0') // Reset rows total if no query
        setSearchTime('0') // Reset search time if no query
        return
      }
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&table=${encodeURIComponent(table)}&offset=${offset}`, // Include offset in the request
        )
        if (!response.ok) throw new Error(`Error: ${response.status}`)
        const data = await response.json()
        const tmp = [...data[0]]
        setResults(tmp)
        tmp?.forEach((i: SearchResult, idx: number) => {
          const authorsPromises = i.data.authors?.map((k: { key: string }) => {
            return fetch(`/api/authors?query=${k.key.replace('/authors/', '')}`)
              .then((response) => response.json())
              .then((res) => ({
                key: res.name,
              }))
          })
          if (Array.isArray(authorsPromises)) {
            Promise.all(authorsPromises).then((authorsResults) => {
              setResults((tmpResult) => {
                const deepResult = [...tmpResult]
                deepResult[idx] = {
                  ...tmpResult[idx],
                  data: {
                    ...(tmpResult[idx]['data'] || {}),
                    authors: authorsResults,
                  },
                }
                return deepResult
              })
            })
          }
        })
        setRowsTotal(data[1][0]['estimate'])
        setSearchTime(data[2])
        setLoading(false)
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to fetch results. Please try again.')
        setResults([])
        setRowsTotal('0') // Reset rows total on error
        setSearchTime('0') // Reset search time on error
        setLoading(false)
      }
    }
    fetchResults()
  }, [query, table, offset]) // Add offset to the dependency array

  const drawFallabck = (k: SearchResult) => {
    const bookDiv = document.createElement('div')
    bookDiv.innerHTML = `<span class="text-balance text-center text-gray-400 border border-gray-400 w-full py-8 px-1">${k.data.title}</span>`
    bookDiv.className = 'w-[200px] h-[300px] bg-gray-100 flex flex-col items-center justify-center px-2'
    document.querySelector(`#img_${k.data.key.replaceAll('/', '')}`)?.replaceWith(bookDiv)
  }

  useEffect(() => {
    results.forEach((k) => {
      if (k?.data?.isbn_13?.[0]) {
        fetch(`https://covers.openlibrary.org/b/isbn/${k.data.isbn_13[0]}-L.jpg`, {
          redirect: 'follow',
        }).then((response) => {
          if (response.status === 200) {
            if (response.headers.get('Content-Type') !== 'image/jpeg') {
              drawFallabck(k)
            } else
              response.blob().then((blob) => {
                document.querySelector(`#img_${k.data.key.replaceAll('/', '')}`)?.setAttribute('src', URL.createObjectURL(blob))
                document.querySelector(`#img_${k.data.key.replaceAll('/', '')}`)?.classList.remove('animate-pulse')
              })
          }
        })
      } else drawFallabck(k)
    })
  }, [results])

  return (
    <>
      <div className="flex flex-col space-y-3 p-6">
        <h2 className="text-xl font-semibold text-white">Results ({loading ? '...' : results.length})</h2>
        <div className="text-sm text-gray-300">Total rows in table: {!loading ? new Intl.NumberFormat('en-US').format(Number(rowsTotal)) : '...'}</div>
        <div className="text-sm text-gray-300">Search time: {!loading ? Number(searchTime).toFixed(2) : '...'} ms</div>
      </div>
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SearchResultSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((result, idx) => (
            <Card key={idx} className="w-full max-w-[300px] border-hidden bg-transparent">
              <CardContent className="space-y-3">
                <img loading="lazy" id={`img_${result.data.key.replaceAll('/', '')}`} className="h-[300px] w-[200px] animate-pulse bg-gray-200 object-cover object-left" />
                <h3 className="text-xl font-bold text-white">{result.data.title}</h3>
                <p className="text-base text-gray-300">
                  {result.data.authors?.map((author: { key: string }, idx: number) => (
                    <span key={`${author.key}_${idx}_${Math.random()}`}>
                      {author.key}
                      {idx !== result.data.authors.length - 1 && ', '}
                    </span>
                  ))}
                </p>
                {result.data.publishers && (
                  <p className="text-base text-gray-400">
                    Published by <span className="text-gray-300">{result.data.publishers?.join(', ')}</span> in <span className="text-gray-300">{result.data.publish_date}</span>
                  </p>
                )}
                {result.data.genres && (
                  <p className="text-base text-gray-400">
                    Genres: <span className="text-gray-300">{result.data.genres?.join(', ')}</span>
                  </p>
                )}
                {result.data.subjects && (
                  <p className="text-base text-gray-400">
                    Subjects: <span className="text-gray-300">{result.data.subjects?.join(', ')}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Pagination controls */}
      <div className="mt-4 flex justify-between">
        <button onClick={() => setOffset(Math.max(0, offset - 12))} disabled={offset === 0} className="btn">
          Previous
        </button>
        <button onClick={() => setOffset(offset + 12)} className="btn">
          Next
        </button>
      </div>
    </>
  )
}
