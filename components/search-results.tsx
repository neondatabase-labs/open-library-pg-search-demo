"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchResultSkeleton } from "@/components/search-result-skeleton";

type SearchResult = {
  id: string | number;
  [key: string]: any;
};

export default function SearchResults({
  query,
  table,
}: {
  query: string;
  table: string;
}) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0); // State variable for pagination
  const [searchTime, setSearchTime] = useState<number | null>(null); // State variable for search time
  const [rowsTotal, setRowsTotal] = useState<number | null>(null); // State variable for total rows

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([]);
        setRowsTotal(null); // Reset rows total if no query
        setSearchTime(null); // Reset search time if no query
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(
            query
          )}&table=${encodeURIComponent(table)}&offset=${offset}` // Include offset in the request
        );
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setResults(data[0]);
        setRowsTotal(data[1][0]["estimate"]);
        setSearchTime(data[2]);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch results. Please try again.");
        setResults([]);
        setRowsTotal(null); // Reset rows total on error
        setSearchTime(null); // Reset search time on error
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, table, offset]); // Add offset to the dependency array

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SearchResultSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  if (results.length === 0 && query)
    return (
      <div className="text-center text-muted-foreground py-4">
        No results found
      </div>
    );

  if (!query)
    return (
      <div className="text-center text-muted-foreground py-4">
        Enter a search term to see results
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Results ({results.length})</h2>
      {rowsTotal !== null && (
        <div className="text-sm text-gray-500">
          Total rows in table: {new Intl.NumberFormat('en-US').format(rowsTotal)}
        </div>
      )}
      {searchTime !== null && (
        <div className="text-sm text-gray-500">
          Search time: {searchTime.toFixed(2)} ms
        </div>
      )}
      {results.map((result) => (
        <Card key={result.id}>
          <CardContent className="p-4">
            <ResultContent result={result} table={table} />
          </CardContent>
        </Card>
      ))}
      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setOffset(Math.max(0, offset - 10))}
          disabled={offset === 0}
          className="btn"
        >
          Previous
        </button>
        <button onClick={() => setOffset(offset + 10)} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}

function ResultContent({
  result,
  table,
}: {
  result: SearchResult;
  table: string;
}) {
  switch (table) {
    default:
      return (
        <pre className="text-sm overflow-auto p-2 bg-muted rounded-md">
          {JSON.stringify(result, null, 2)}
        </pre>
      );
  }
}
