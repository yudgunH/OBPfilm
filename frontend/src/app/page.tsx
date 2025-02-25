import FeaturedBanner from "@/components/featured-banner"
import MovieList from "@/components/movie-list"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <FeaturedBanner />
      <div className="container mx-auto px-4 py-8">
        <MovieList title="New Movies" category="new" />
        <MovieList title="Hot Movies" category="hot" />
        <MovieList title="Recommended Movies" category="recommended" />
      </div>
    </main>
  )
}

