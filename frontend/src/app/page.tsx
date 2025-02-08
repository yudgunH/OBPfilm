import FeaturedBanner from "@/components/featured-banner"
import MovieList from "@/components/movie-list"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <FeaturedBanner />
      <div className="container mx-auto px-4 py-8">
        <MovieList title="Phim mới" category="new" />
        <MovieList title="Phim hot" category="trending" />
        <MovieList title="Phim đề xuất" category="recommended" />
      </div>
    </main>
  )
}

