"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X } from "lucide-react"
import MovieCard from "@/components/movie-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for search results and suggestions
const mockMovies = [
  { id: "1", title: "Inception", genre: "Sci-Fi", year: 2010, poster: "/placeholder.svg?height=400&width=300", rating: 8.8 },
  { id: "2", title: "The Dark Knight", genre: "Action", year: 2008, poster: "/placeholder.svg?height=400&width=300", rating: 9.0 },
  { id: "3", title: "Interstellar", genre: "Sci-Fi", year: 2014, poster: "/placeholder.svg?height=400&width=300", rating: 8.6 },
  { id: "4", title: "Pulp Fiction", genre: "Crime", year: 1994, poster: "/placeholder.svg?height=400&width=300", rating: 8.9 },
  { id: "5", title: "The Matrix", genre: "Sci-Fi", year: 1999, poster: "/placeholder.svg?height=400&width=300", rating: 8.7 },
  { id: "6", title: "Forrest Gump", genre: "Drama", year: 1994, poster: "/placeholder.svg?height=400&width=300", rating: 8.8 },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(mockMovies)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    // Simulating API call for search results
    const filteredResults = mockMovies.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setSearchResults(filteredResults)

    // Simulating API call for suggestions
    const mockSuggestions = ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Thriller"]
    const filteredSuggestions = mockSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setSuggestions(filteredSuggestions)
  }, [searchQuery])

  const handleSort = (value: string) => {
    setSortBy(value)
    const sortedResults = [...searchResults]
    if (value === "year-desc") {
      sortedResults.sort((a, b) => b.year - a.year)
    } else if (value === "year-asc") {
      sortedResults.sort((a, b) => a.year - b.year)
    }
    setSearchResults(sortedResults)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search Bar */}
      <section className="bg-gradient-to-b from-primary/20 to-background py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Discover Your Next Favorite Movie</h1>
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 text-lg py-6"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-12 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
          {/* Auto-suggestions */}
          {suggestions.length > 0 && searchQuery && (
            <div className="max-w-2xl mx-auto mt-2 bg-background border rounded-md shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-accent cursor-pointer"
                  onClick={() => setSearchQuery(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Search Results Summary and Sorting */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">
              🔍 {searchResults.length} results found for &quot;{searchQuery}&quot;
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="year-desc">Newest</SelectItem>
                  <SelectItem value="year-asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold mb-4">No results found</h3>
              <p className="text-muted-foreground mb-8">
                We couldn&apos;t find any movies matching your search. Try different keywords or explore our
                recommendations below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Action", "Comedy", "Drama", "Sci-Fi", "Thriller"].map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-lg py-2 px-4 cursor-pointer">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Movie Suggestions */}
      <section className="py-12 bg-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {mockMovies.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

