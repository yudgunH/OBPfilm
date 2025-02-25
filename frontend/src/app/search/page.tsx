"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";
import MovieCard from "@/components/movie-card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMovie } from "@/app/providers/MovieContext"; // Đảm bảo context có cung cấp fetchMovies
import { Movie } from "@/app/providers/MovieContext";

const mockSuggestions = ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Thriller"];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialGenre = searchParams.get("genre") || "";

  // Lấy movies và hàm fetchMovies từ MovieContext
  const { movies, fetchMovies } = useMovie();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");

  // Gọi fetchMovies khi component mount để lấy lại dữ liệu
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Lọc kết quả tìm kiếm dựa vào searchQuery, selectedGenre và movies
  useEffect(() => {
    const filteredResults = movies.filter((movie) => {
      const matchesTitle = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "" || movie.genre.toLowerCase() === selectedGenre.toLowerCase();
      return matchesTitle && matchesGenre;
    });
    setSearchResults(filteredResults);

    // Lọc gợi ý cho search input dựa trên mockSuggestions
    const filteredSuggestions = mockSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }, [searchQuery, movies, selectedGenre]);

  // Xử lý sắp xếp kết quả theo tiêu chí (ví dụ: năm phát hành)
  const handleSort = (value: string) => {
    setSortBy(value);
    const sortedResults = [...searchResults];
    if (value === "year-desc") {
      sortedResults.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (value === "year-asc") {
      sortedResults.sort((a, b) => a.releaseYear - b.releaseYear);
    }
    setSearchResults(sortedResults);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search Bar */}
      <section className="bg-gradient-to-b from-primary/20 to-background py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Discover Your Next Favorite Movie
          </h1>
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
            <Button
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
          {/* Auto-suggestions cho tìm kiếm tiêu đề */}
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
          {/* Bộ lọc theo thể loại phim */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Filter by Genre:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                key="All"
                variant={selectedGenre === "" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedGenre("")}
              >
                All
              </Badge>
              {mockSuggestions.map((genre) => (
                <Badge
                  key={genre}
                  variant={
                    selectedGenre.toLowerCase() === genre.toLowerCase()
                      ? "default"
                      : "secondary"
                  }
                  className="cursor-pointer"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">
              🔍 {searchResults.length} results found for &quot;{searchQuery}&quot;
              {selectedGenre && <span> in {selectedGenre}</span>}
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
                We couldn&apos;t find any movies matching your search. Try different keywords or explore our recommendations below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Action", "Comedy", "Drama", "Sci-Fi", "Thriller"].map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="text-lg py-2 px-4 cursor-pointer"
                    onClick={() => setSelectedGenre(genre)}
                  >
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
            {movies.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
