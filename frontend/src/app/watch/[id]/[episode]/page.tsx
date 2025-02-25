"use client";

import { DialogFooter } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useMovie, type Movie } from "@/app/providers/MovieContext";
import { VerticalCarousel } from "@/components/vertical-carousel";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Biến toàn cục để lưu lại movieId đã được cập nhật watch history
const updatedMovieIds = new Set<number>();

interface EpisodeAPI {
  id: number;
  movieId: number;
  episodeNumber: number;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentAPI {
  id: number;
  movieId: number;
  userId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export default function WatchPage() {
  const { id } = useParams();
  const { movies, fetchMovies } = useMovie();
  const { data: session } = useSession();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [apiEpisodes, setApiEpisodes] = useState<EpisodeAPI[]>([]);
  const [apiComments, setApiComments] = useState<CommentAPI[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [comment, setComment] = useState("");
  const [videoSize, setVideoSize] = useState<"normal" | "theater" | "fullscreen">("normal");
  const [showCursor, setShowCursor] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportIssue, setReportIssue] = useState("");
  const [isFullTitleVisible, setIsFullTitleVisible] = useState(false);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Hàm cập nhật watch history
  const updateWatchHistory = async (movieId: number) => {
    if (!session) return;
    try {
      await axios.post(
        "http://localhost:5000/api/user-watch-histories",
        { movieId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log("Watch history updated for movieId:", movieId);
    } catch (error) {
      console.error("Error updating watch history:", error);
    }
  };

  // useEffect để gọi API update watch history
  // Kiểm tra nếu movie và session đã có, và movie.id chưa có trong updatedMovieIds thì gọi updateWatchHistory
  useEffect(() => {
    if (movie && session && !updatedMovieIds.has(movie.id)) {
      updateWatchHistory(movie.id);
      updatedMovieIds.add(movie.id);
    }
  }, [movie, session]);

  // Xử lý ẩn hiện con trỏ khi di chuyển chuột
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowCursor(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowCursor(false), 3000);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Lấy thông tin movie từ params hoặc fetch movies nếu chưa có dữ liệu
  useEffect(() => {
    if (!id) return;
    const movieId = typeof id === "string" ? Number(id) : Number(id[0]);
    const found = movies.find((m) => m.id === movieId);
    if (found) {
      setMovie(found);
    }
    if (movies.length === 0) {
      fetchMovies();
    }
  }, [id, movies, fetchMovies]);

  // Lấy danh sách episodes của movie
  useEffect(() => {
    if (!movie) return;
    axios
      .get(`http://localhost:5000/api/episodes/movie/${movie.id}`)
      .then((response) => {
        setApiEpisodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching episodes:", error);
      });
  }, [movie]);

  // Lấy danh sách comments của movie
  useEffect(() => {
    if (!movie) return;
    axios
      .get(`http://localhost:5000/api/movie-comments/movie/${movie.id}`)
      .then((response) => {
        setApiComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [movie]);

  // Kiểm tra tiêu đề có bị tràn không
  useEffect(() => {
    const checkTitleOverflow = () => {
      if (titleRef.current) {
        setIsTitleOverflowing(titleRef.current.scrollHeight > titleRef.current.clientHeight);
      }
    };

    checkTitleOverflow();
    window.addEventListener("resize", checkTitleOverflow);

    return () => {
      window.removeEventListener("resize", checkTitleOverflow);
    };
  }, []);

  const handleNextEpisode = () => {
    if (movie && selectedEpisode < movie.totalEpisodes) {
      setSelectedEpisode(selectedEpisode + 1);
    }
  };

  const handlePostComment = async () => {
    if (!session) {
      console.error("User chưa đăng nhập");
      return;
    }
    if (!movie) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/movie-comments",
        {
          movieId: movie.id,
          comment: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log("Comment posted successfully:", response.data);
      setApiComments((prev) => [...prev, response.data]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const selectedEpisodeData = apiEpisodes.find((e) => e.episodeNumber === selectedEpisode);
  const videoSrc = selectedEpisodeData ? selectedEpisodeData.videoUrl : movie?.trailerUrl || null;

  const similarMovies = movie
    ? movies.filter((m) => m.id !== movie.id && m.genre.toLowerCase() === movie.genre.toLowerCase())
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div
        className={`${
          videoSize === "normal"
            ? "w-full max-w-[1200px] mx-auto"
            : videoSize === "theater"
            ? "w-full max-w-[1500px] mx-auto"
            : "fixed inset-0 z-50 bg-black"
        }`}
        style={{ cursor: showCursor ? "auto" : "none" }}
      >
        <VideoPlayer
          src={videoSrc || "/placeholder.svg?height=1080&width=1920"}
          poster={movie?.posterUrl || "/placeholder.svg?height=1080&width=1920"}
          onNext={handleNextEpisode}
          hasNextEpisode={movie ? selectedEpisode < movie.totalEpisodes : false}
          videoSize={videoSize}
          setVideoSize={setVideoSize}
        />
      </div>

      {videoSize !== "fullscreen" && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700 mb-8">
                <CardContent className="p-6">
                  <h1 ref={titleRef} className={`text-3xl font-bold mb-2 ${isFullTitleVisible ? "" : "line-clamp-3"}`}>
                    {movie?.title}
                  </h1>
                  {isTitleOverflowing && (
                    <Button
                      variant="link"
                      onClick={() => setIsFullTitleVisible(!isFullTitleVisible)}
                      className="p-0 h-auto font-normal text-blue-400"
                    >
                      {isFullTitleVisible ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Thu gọn
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Xem thêm
                        </>
                      )}
                    </Button>
                  )}
                  <h2 className="text-xl text-gray-300 mb-4">Episode {selectedEpisode}</h2>
                  <p className="text-gray-400">{movie?.summary}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Episodes</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie &&
                      Array.from({ length: movie.totalEpisodes }, (_, i) => i + 1).map((num) => (
                        <Button
                          key={num}
                          variant={selectedEpisode === num ? "default" : "outline"}
                          onClick={() => setSelectedEpisode(num)}
                          className={`min-w-[48px] ${selectedEpisode === num ? "bg-red-600 hover:bg-red-700" : ""}`}
                        >
                          {num}
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Comments</h3>
                    <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Report Issue
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Report an Issue</DialogTitle>
                          <DialogDescription>
                            Describe the issue you&apos;re experiencing. We&apos;ll review it as soon as possible.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Textarea
                            placeholder="Describe the issue..."
                            value={reportIssue}
                            onChange={(e) => setReportIssue(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => {
                              console.log("Report submitted:", reportIssue);
                              setIsReportDialogOpen(false);
                              setReportIssue("");
                            }}
                          >
                            Submit Report
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <Input
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.stopPropagation();
                        }
                      }}
                      className="bg-gray-700 border-gray-600"
                    />
                    <Button className="bg-red-600 hover:bg-red-700" onClick={handlePostComment}>
                      Comment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {apiComments.map((c) => (
                      <div key={c.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">Anonymous user</span>
                          <span className="text-sm text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <p>{c.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="hidden lg:block">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">You May Also Like</h3>
                  <VerticalCarousel movies={similarMovies} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
