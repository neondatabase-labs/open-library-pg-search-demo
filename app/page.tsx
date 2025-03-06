import SearchInterface from "@/components/search-interface"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Database Search</h1>
      <SearchInterface />
    </main>
  )
}

