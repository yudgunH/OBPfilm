"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { VideoPlayer } from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Star, AlertTriangle } from "lucide-react"

// Mock data
const movieData = {
  id: "1",
  title: "Stranger Things",
  description:
    "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  poster: "/placeholder.svg?height=1080&width=1920",
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
  comments: [
    { id: "1", user: "User1", content: "Amazing episode!", timestamp: "2 hours ago" },
    { id: "2", user: "User2", content: "Can't wait for the next one!", timestamp: "1 day ago" },
  ],
}

export default function WatchPage() {
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [comment, setComment] = useState("")
  const [userRating, setUserRating] = useState(0)

  const handleNextEpisode = () => {
    if (selectedEpisode < movieData.episodes.length) {
      setSelectedEpisode(selectedEpisode + 1)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Video Player */}
      <div className="w-full max-w-[1920px] mx-auto">
        <VideoPlayer
          src={movieData.videoUrl}
          poster={movieData.poster}
          onNext={handleNextEpisode}
          hasNextEpisode={selectedEpisode < movieData.episodes.length}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Episode Information */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{movieData.title}</h1>
              <h2 className="text-xl mb-4">
                Episode {selectedEpisode}: {movieData.episodes[selectedEpisode - 1]?.title}
              </h2>
              <p className="text-gray-400">{movieData.description}</p>
            </div>

            {/* Episode List */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Episodes</h3>
              <div className="flex flex-wrap gap-2">
                {movieData.episodes.map((episode) => (
                  <Button
                    key={episode.id}
                    variant={selectedEpisode === episode.number ? "default" : "outline"}
                    onClick={() => setSelectedEpisode(episode.number)}
                    className={`min-w-[48px] ${
                      selectedEpisode === episode.number ? "bg-red-600 hover:bg-red-700" : ""
                    }`}
                  >
                    {episode.number}
                  </Button>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Comments</h3>
                <Button variant="outline" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Report Issue
                </Button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                      }`}
                      onClick={() => setUserRating(star)}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {userRating > 0 ? `${userRating}/5` : "Rate this episode"}
                </span>
              </div>

              {/* Comment Input */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
                <Button>Comment</Button>
              </div>

              {/* Comment List */}
              <div className="space-y-4">
                {movieData.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{comment.user}</span>
                      <span className="text-sm text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Similar Movies Sidebar */}
          <div>
            <h3 className="text-xl font-bold mb-4">You May Also Like</h3>
            <div className="grid gap-4">
              {movieData.similarMovies.map((movie) => (
                <Link key={movie.id} href={`/watch/${movie.id}`}>
                  <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                    <CardContent className="p-2">
                      <div className="relative aspect-video mb-2">
                        <Image
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                      <p className="font-semibold truncate">{movie.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

