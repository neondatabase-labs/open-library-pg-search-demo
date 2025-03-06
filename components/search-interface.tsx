"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchResults from "@/components/search-results";

const tables = [
  { id: "authors", name: "Authors" },
  { id: "editions", name: "Editions" },
  { id: "works", name: "Works" },
];

const THROTTLE_DELAY = 300; // milliseconds

export default function SearchInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("query") || "";
  const initialTable = searchParams.get("table") || "authors";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTable, setSelectedTable] = useState(initialTable);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    params.set("table", selectedTable);

    const handleSearch = () => {
      setIsSearching(true);
      router.push(`?${params.toString()}`);
      setTimeout(() => setIsSearching(false), 100);
    };

    const handler = setTimeout(handleSearch, THROTTLE_DELAY);
    return () => clearTimeout(handler);
  }, [searchQuery, selectedTable, router]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              value={searchQuery}
              placeholder="Search database..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table.id} value={table.id}>
                  {table.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <SearchResults
        query={searchParams.get("query") || ""}
        table={searchParams.get("table") || "authors"}
      />
    </div>
  );
}
