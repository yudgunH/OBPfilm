"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Heart, PlayCircle, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useMovie } from "@/app/providers/MovieContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface MovieDetailData {
  id: number;
  title: string;
  rating: string;
  views: number;
  genre: string;
  summary: string;
  duration: number;
  totalEpisodes: number;
  releaseYear: number;
  posterUrl: string;
  trailerUrl: string;
  status: string;
}

export default function MovieDetail() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [openTrailer, setOpenTrailer] = useState(false);
  const { movies, fetchMovies } = useMovie();
  const [isCollected, setIsCollected] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { toast } = useToast();

  // Lấy danh sách phim từ context
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Lấy thông tin phim dựa trên id trong URL
  useEffect(() => {
    if (!id) return;
    const fetchMovie = async () => {
      try {
        const response = await axios.get<MovieDetailData>(`http://localhost:5000/api/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Kiểm tra chiều cao của mô tả để hiển thị "Read more/Collapse"
  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = Number.parseInt(window.getComputedStyle(descriptionRef.current).lineHeight);
      const maxHeight = lineHeight * 6;
      setIsDescriptionExpanded(descriptionRef.current.scrollHeight > maxHeight);
    }
  }, []);

  // Kiểm tra xem phim đã được collected hay chưa bằng cách lấy danh sách favorites của người dùng
  useEffect(() => {
    // Chỉ chạy khi status không phải "loading"
    if (status !== "loading") {
      // Nếu người dùng chưa đăng nhập, mặc định phim chưa được collected
      if (status !== "authenticated") {
        setIsCollected(false);
        return;
      }
      if (movie) {
        // Lấy token từ session 
        const token = session?.token 
        if (!token) {
          console.warn("Token is missing in session");
          return;
        }
        axios
          .get("http://localhost:5000/api/user-favorites", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const favorites = response.data; // Đây là mảng các mục đã được collected
            const found = favorites.some((fav: { movieId: number }) => fav.movieId === movie.id);
            setIsCollected(found);
          })
          .catch((error) => {
            console.error("Error fetching user favorites:", error);
          });
      }
    }
  }, [status, session, movie]);

  const handlePlayVideo = () => {
    if (movie?.id) {
      router.push(`/watch/${movie.id}/${selectedEpisode}`);
    }
  };

  // Xử lý nút Collect: nếu chưa collected thì gọi POST để thêm, nếu đã collected thì gọi DELETE để xóa
  const handleCollectToggle = async () => {
    if (status !== "authenticated") {
      toast({
        title: "Unauthorized",
        description: "Please log in to add to favorites.",
        variant: "destructive",
      });
      return;
    }
    const token = session?.token
    if (!token) {
      toast({
        title: "Error",
        description: "Token is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!isCollected) {
        await axios.post(
          "http://localhost:5000/api/user-favorites",
          { movieId: movie?.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsCollected(true);
        toast({
          title: "Added to favorites",
          description: "Movie added to your favorites.",
          variant: "default",
        });
      } else {
        await axios.delete(`http://localhost:5000/api/user-favorites/movie/${movie?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsCollected(false);
        toast({
          title: "Removed from favorites",
          description: "Movie removed from your favorites.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating favorites.",
        variant: "destructive",
      });
    }
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const topMovies = movies
    .filter((m) => m.id !== movie.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const recommendedMovies = movies
    .filter((m) => m.id !== movie.id && m.genre.toLowerCase() === movie.genre.toLowerCase())
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <Toaster />
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Side - Poster */}
          <div className="xl:w-[560px] flex-shrink-0">
            <div className="relative w-full xl:w-[560px] aspect-[4/5]">
              <Image
                src={movie.posterUrl || "/placeholder.svg?height=560&width=800"}
                alt={movie.title}
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>

          {/* Middle and Right Content */}
          <div className="flex-1 flex flex-col xl:flex-row gap-8">
            {/* Middle Content */}
            <div className="flex-1 space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold">{movie.title}</h1>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">VIP</Badge>
                <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">{movie.genre}</Badge>
                <Badge variant="outline">{movie.releaseYear}</Badge>
                <Badge variant="outline">{movie.duration} min</Badge>
              </div>

              {/* Movie Stats */}
              <div className="text-gray-400 space-y-2 text-sm sm:text-base">
                <p>Total Episodes: {movie.totalEpisodes}</p>
                <p>Status: {movie.status || "Completed"}</p>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 w-5 h-5" />
                  <span>{Number(movie.rating).toFixed(1)}</span>
                  <span>({movie.views} views)</span>
                </div>
              </div>

              {/* Description */}
              <div className="relative">
                <p
                  ref={descriptionRef}
                  className={`text-gray-300 leading-relaxed text-sm lg:text-base ${
                    !isDescriptionExpanded ? "line-clamp-6" : ""
                  }`}
                >
                  {movie.summary}
                </p>
                {isDescriptionExpanded && (
                  <Button
                    variant="link"
                    className="text-purple-400 mt-2"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Collapse <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 lg:px-8" onClick={handlePlayVideo}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Now
                </Button>
                <Dialog open={openTrailer} onOpenChange={setOpenTrailer}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                      Watch Trailer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{movie.title} - Trailer</DialogTitle>
                      <DialogDescription>Enjoy the trailer!</DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video">
                      <video controls src={movie.trailerUrl} className="w-full h-full" />
                    </div>
                    <DialogClose asChild>
                      <Button className="mt-4">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  className={`border-purple-500 text-purple-400 hover:bg-purple-500/10 ${isCollected ? "bg-purple-500/20" : ""}`}
                  onClick={handleCollectToggle}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isCollected ? "fill-purple-400" : ""}`} />
                  {isCollected ? "Collected" : "Collect"}
                </Button>
              </div>

              {/* Episode List */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Episode List</h2>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {Array.from({ length: movie.totalEpisodes || 63 }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className={`w-full justify-center px-2 ${
                          selectedEpisode === i + 1
                            ? "bg-purple-500/20 border-purple-500 text-purple-400"
                            : "hover:bg-purple-500/10"
                        }`}
                        onClick={() => {
                          setSelectedEpisode(i + 1);
                          router.push(`/watch/${movie.id}/${i + 1}`);
                        }}
                      >
                        <span className="sm:hidden">{i + 1}</span>
                        <span className="hidden sm:inline">Ep {i + 1}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Right Sidebar - Rankings */}
            <div className="hidden xl:block xl:w-[300px] flex-shrink-0">
              <Card className="bg-gray-800 border-none sticky top-6">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Top 10 Views Rankings</h2>
                  <div className="space-y-4">
                    {topMovies.map((m, index) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg"
                        onClick={() => router.push(`/movie/${m.id}`)}
                      >
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <div className="flex-1">
                          <p className="font-medium truncate">{m.title}</p>
                          <p className="text-sm text-gray-400">{m.views} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Recommended Movies */}
        {recommendedMovies.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recommended Movies</h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {recommendedMovies.map((recMovie) => (
                  <CarouselItem key={recMovie.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
                    <div className="cursor-pointer" onClick={() => router.push(`/movie/${recMovie.id}`)}>
                      <Image
                        src={recMovie.posterUrl || "/placeholder.svg"}
                        alt={recMovie.title}
                        width={150}
                        height={225}
                        className="rounded-lg object-cover w-full h-[325px]"
                      />
                      <p className="text-sm mt-2 truncate">{recMovie.title}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Movie Reviews</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${star <= userRating ? "text-yellow-400" : "text-gray-400"}`}
                  onClick={() => setUserRating(star)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Share your thoughts about the movie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] bg-gray-800 border-gray-700"
            />
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                toast({
                  title: "Review Submitted",
                  description: "Thank you for your feedback!",
                  duration: 3000,
                });
                setUserRating(0);
                setComment("");
              }}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
