"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { PlayCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Mock data for the movie
const movie = {
  id: "1",
  title: "Stranger Things",
  description:
    "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
  poster: "/feature_banner.png?height=1080&width=1920",
  genres: ["Drama", "Fantasy", "Horror"],
  duration: "50min per episode",
  releaseYear: 2016,
  cast: [
    { name: "Millie Bobby Brown", image: "/placeholder.svg?height=100&width=100" },
    { name: "Finn Wolfhard", image: "/placeholder.svg?height=100&width=100" },
    { name: "Winona Ryder", image: "/placeholder.svg?height=100&width=100" },
  ],
  rating: 8.7,
  isSeries: true,
  episodes: [
    { id: "1", number: 1, title: "Chapter One: The Vanishing of Will Byers" },
    { id: "2", number: 2, title: "Chapter Two: The Weirdo on Maple Street" },
    { id: "3", number: 3, title: "Chapter Three: Holly, Jolly" },
    { id: "4", number: 4, title: "Chapter Four: The Body" },
    { id: "5", number: 5, title: "Chapter Five: The Flea and the Acrobat" },
    { id: "6", number: 6, title: "Chapter Six: The Monster" },
    { id: "7", number: 7, title: "Chapter Seven: The Bathtub" },
    { id: "8", number: 8, title: "Chapter Eight: The Upside Down" },
  ],
  similarMovies: [
    { id: "2", title: "The OA", poster: "/placeholder.svg?height=300&width=200" },
    { id: "3", title: "Dark", poster: "/placeholder.svg?height=300&width=200" },
    { id: "4", title: "Black Mirror", poster: "/placeholder.svg?height=300&width=200" },
  ],
}

export default function MovieDetail() {
  const [userRating, setUserRating] = useState(0)
  const [comment, setComment] = useState("")
  const [selectedEpisode, setSelectedEpisode] = useState(1)

  const router = useRouter();
  
  const handlePlayVideo = () => {
    router.push(`/watch/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} layout="fill" objectFit="cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <Button className="bg-red-600 hover:bg-red-700" onClick={handlePlayVideo}>
            <PlayCircle className="mr-2 h-4 w-4" /> Play Video
          </Button>
          
        </div>
      </div>

      {/* Movie Information Card */}
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 bg-opacity-60 backdrop-blur-lg border-none text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                <p className="text-gray-300 mb-4">{movie.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mb-2">Duration: {movie.duration}</p>
                <p className="text-sm text-gray-400 mb-4">Release Year: {movie.releaseYear}</p>
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 mr-1" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
                <Button variant="outline" className="mr-2">
                  Watch Trailer
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.cast.map((actor) => (
                    <div key={actor.name} className="flex items-center">
                      <Image
                        src={actor.image || "/placeholder.svg"}
                        alt={actor.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-2"
                      />
                      <span className="text-sm">{actor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Episode List (for TV Series only) */}
      {movie.isSeries && movie.episodes && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {movie.episodes.map((episode) => (
                <Button
                  key={episode.id}
                  variant={selectedEpisode === episode.number ? "default" : "outline"}
                  onClick={() => setSelectedEpisode(episode.number)}
                  className={`min-w-[48px] ${selectedEpisode === episode.number ? "bg-red-600 hover:bg-red-700" : ""}`}
                >
                  {episode.number}
                </Button>
              ))}
            </div>
            {selectedEpisode && (
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">
                  {movie.episodes.find((ep) => ep.number === selectedEpisode)?.title}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Similar Movies Recommendations */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movie.similarMovies.map((similarMovie) => (
            <Link key={similarMovie.id} href={`/movie/${similarMovie.id}`}>
              <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                <CardContent className="p-2">
                  <Image
                    src={similarMovie.poster || "/placeholder.svg"}
                    alt={similarMovie.title}
                    width={200}
                    height={300}
                    className="rounded-md mb-2"
                  />
                  <p className="text-sm font-semibold truncate">{similarMovie.title}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* User Engagement Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Review</h2>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${star <= userRating ? "text-yellow-400" : "text-gray-400"}`}
              onClick={() => setUserRating(star)}
            />
          ))}
        </div>
        <Textarea
          placeholder="Write your comment here..."
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          className="mb-4"
        />
        <Button>Submit Review</Button>
      </div>
    </div>
  )
}

