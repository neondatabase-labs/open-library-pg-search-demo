'use client'

import SearchResultSkeleton from '@/components/search-result-skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

type SearchResult = {
  id: string | number
  [key: string]: any
}

export default function SearchResults({ query, offset, setOffset }: { query: string; offset: number; setOffset: (offset: number) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [rowsTotal, setRowsTotal] = useState<string | number>('0')
  const [searchTime, setSearchTime] = useState<string | number>('0')
  const [totalPages, setTotalPages] = useState<string | number>('0')

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      if (!query) {
        resetResults()
        return
      }
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&offset=${offset}`)
        if (!response.ok) throw new Error(`Error: ${response.status}`)
        const data = await response.json()
        const tmpResults = [...data[0]]
        setResults(tmpResults) // Set results without authors first
        setRowsTotal(data[1][0]['estimate'])
        setTotalPages(data[2])
        setSearchTime(data[3])
        tmpResults.forEach((result) => {
          if (result?.data?.isbn_13?.[0]) {
            fetchCoverImage(result)
          } else {
            drawFallback(result)
          }
        })
        // Now enrich results with authors
        enrichResultsWithAuthors(tmpResults).then((res) => setResults(res))
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to fetch results. Please try again.')
        resetResults()
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [query, offset])

  const resetResults = () => {
    setResults([])
    setRowsTotal('0')
    setSearchTime('0')
    setTotalPages('0')
  }

  const enrichResultsWithAuthors = async (results: SearchResult[]) => {
    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const authors = await fetchAuthors(result.data.authors)
        return {
          ...result,
          data: {
            ...result.data,
            authors,
          },
        }
      }),
    )
    return enrichedResults
  }

  const fetchAuthors = async (authors: { key: string }[] | undefined) => {
    if (!authors) return []
    const authorPromises = authors.map(async (author) => {
      const response = await fetch(`/api/authors?query=${author.key.replace('/authors/', '')}`)
      const res = await response.json()
      return { key: res.name }
    })
    return Promise.all(authorPromises)
  }

  const drawFallback = (result: SearchResult) => {
    const bookDiv = document.createElement('div')
    bookDiv.innerHTML = `<span class="text-balance text-center text-gray-400 border border-gray-400 break-all w-full py-8 px-1">${result.data.title.length > 100 ? result.data.title.substring(0, 100) + '...' : result.data.title}</span>`
    bookDiv.className = 'w-[200px] h-[300px] max-w-full bg-gray-100 flex flex-col items-center justify-center px-2'
    document.querySelector(`#img_${result.data.key.replaceAll('/', '')}`)?.replaceWith(bookDiv)
  }

  const fetchCoverImage = (result: SearchResult) => {
    fetch(`https://covers.openlibrary.org/b/isbn/${result.data.isbn_13[0]}-L.jpg`, { redirect: 'follow' })
      .then((response) => {
        if (response.ok) {
          if (response.headers.get('Content-Type') !== 'image/jpeg') {
            drawFallback(result)
          } else {
            return response.blob().then((blob) => {
              const imgElement = document.querySelector(`#img_${result.data.key.replaceAll('/', '')}`)
              if (imgElement) {
                imgElement.setAttribute('src', URL.createObjectURL(blob))
                imgElement.classList.remove('animate-pulse')
              }
            })
          }
        } else drawFallback(result)
      })
      .catch(() => drawFallback(result))
  }

  return (
    <>
      <div className="mt-8 flex flex-col space-y-3">
        <h2 className="text-xl font-semibold text-white">Results ({loading ? '...' : results.length})</h2>
        <div className="text-sm text-gray-300">Total rows in table: {!loading ? new Intl.NumberFormat('en-US').format(Number(rowsTotal)) : '...'}</div>
        <div className="text-sm text-gray-300">Search time: {!loading ? Number(searchTime).toFixed(2) : '...'} ms</div>
        <div className="text-sm text-gray-300">
          Current page: {!loading ? (Number(totalPages) > 0 ? Math.ceil(offset / 12) + 1 : 0) : '...'}/{!loading ? Math.ceil(Number(totalPages) / 12) : '...'}
        </div>
      </div>
      {loading ? (
        <div className="space-y-4">
          <div className="flex flex-row flex-wrap gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <SearchResultSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-4 md:gap-8">
          {results.map((result, idx) => (
            <Card key={idx} className="w-full max-w-[160px] border-hidden bg-transparent md:max-w-[200px]">
              <CardContent className="space-y-3 px-0 break-all">
                <img
                  loading="lazy"
                  id={`img_${result.data.key.replaceAll('/', '')}`}
                  className="h-[300px] w-[200px] max-w-full animate-pulse bg-gray-200 object-cover object-left"
                />
                <a target="_blank" className="text-sm text-gray-400 hover:underline" href={`https://openlibrary.org${result.data.key}`}>
                  View in Open Library &#x2197;
                </a>
                <h3 className="mt-2 text-xl font-bold text-white">{result.data.title}</h3>
                <p className="text-base text-gray-300">
                  {result.data.authors?.map((author: { key: string }, idx: number) => (
                    <span key={`${author.key}_${idx}`}>
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
      <div className="my-4 flex justify-between">
        <Button
          onClick={() => {
            setOffset(Math.max(0, offset - 12))
            window.scrollTo(0, 0)
          }}
          disabled={offset === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            setOffset(offset + 12)
            window.scrollTo(0, 0)
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}
