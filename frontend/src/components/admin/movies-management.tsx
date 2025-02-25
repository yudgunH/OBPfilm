"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusCircle, Search, Upload } from 'lucide-react'
import { Toaster, toast } from "react-hot-toast";

//
// === Interfaces & Helper Functions ===
//

export interface Movie {
  id: number;
  title: string;
  genre: string;
  year: number;
  episodes: number;
  views: number;
  rating: number;
  summary: string;
  poster: string | File | null;
  trailer: string | File | null;
}

interface ApiMovie {
  id: number;
  title: string;
  genre: string;
  releaseYear: number;
  totalEpisodes: number;
  views: number;
  rating: string | number;
  summary: string;
  posterUrl: string | null;
  trailerUrl: string | null;
}

export interface Episode {
  id: number;
  episodeNumber: number;
  video: string | null;
}

interface ApiEpisode {
  id: number;
  episodeNumber: number;
  videoUrl: string | null;
}

export interface MovieFormProps {
  movie?: Movie;
  onSubmit: (movie: Omit<Movie, "id">) => void;
}

const transformApiMovieToFrontend = (movie: ApiMovie): Movie => ({
  id: movie.id,
  title: movie.title,
  genre: movie.genre,
  year: movie.releaseYear,
  episodes: movie.totalEpisodes,
  views: movie.views,
  rating: Number(movie.rating),
  summary: movie.summary,
  poster: movie.posterUrl,
  trailer: movie.trailerUrl,
});

const transformMovieToApi = (movie: Omit<Movie, "id">) => ({
  title: movie.title,
  rating: movie.rating,
  views: movie.views,
  genre: movie.genre,
  summary: movie.summary,
  duration: 120, // giá trị mặc định
  total_episodes: movie.episodes,
  releaseYear: movie.year,
  posterUrl: movie.poster,
  trailerUrl: movie.trailer,
});

//
// === Upload Functions with Progress Callback ===
//

async function uploadFile(
  title: string,
  file: File,
  fieldName: string,
  onProgress?: (progress: number) => void
): Promise<string | null> {
  try {
    const contentType = fieldName === "poster" ? "image/jpeg" : "video/mp4";
    const fileName = `${fieldName}-${Date.now()}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("fileName", fileName);
    formData.append("contentType", contentType);

    const response = await axios.post("http://localhost:5000/api/aws/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
    });

    toast.success("File uploaded successfully!");
    return response.data.finalUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Failed to upload file.");
    return null;
  }
}

async function uploadEpisodeFile(
  movieTitle: string,
  episodeNumber: number,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string | null> {
  try {
    const contentType = "video/mp4";
    const fileName = `episode-${episodeNumber}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", movieTitle);
    formData.append("fileName", fileName);
    formData.append("contentType", contentType);

    const response = await axios.post("http://localhost:5000/api/aws/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
    });

    return response.data.finalUrl;
  } catch (error) {
    console.error("Error uploading episode file:", error);
    toast.error("Failed to upload episode file.");
    return null;
  }
}

//
// === Types for Upload Progress ===
//

type UploadProgress = {
  id: string; // unique id for each movie upload
  title: string;
  progress: number;
};

// Thêm trường movieTitle để hiển thị tên phim cho từng episode
type EpisodeUploadProgress = {
  id: string; // unique id for each episode upload
  movieTitle: string;
  episodeNumber: number;
  progress: number;
};

//
// === Main Component: MoviesManagement ===
//

export function MoviesManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [uploadingMovies, setUploadingMovies] = useState<UploadProgress[]>([]);
  const [uploadingEpisodes, setUploadingEpisodes] = useState<EpisodeUploadProgress[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();

  // Fetch movies from API
  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/movies");
      const moviesData: Movie[] = response.data.map((movie: ApiMovie) =>
        transformApiMovieToFrontend(movie)
      );
      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Update progress for movie upload
  const updateUploadProgress = (id: string, progress: number) => {
    setUploadingMovies((prevUploads: UploadProgress[]) =>
      prevUploads.map((upload: UploadProgress) =>
        upload.id === id ? { ...upload, progress } : upload
      )
    );
  };

  // Update progress for episode upload
  const updateEpisodeUploadProgress = (id: string, progress: number) => {
    setUploadingEpisodes((prevUploads: EpisodeUploadProgress[]) =>
      prevUploads.map((upload: EpisodeUploadProgress) =>
        upload.id === id ? { ...upload, progress } : upload
      )
    );
  };

  // Functions để thêm/xoá progress của episode
  const addUploadingEpisode = (upload: EpisodeUploadProgress) => {
    setUploadingEpisodes((prev: EpisodeUploadProgress[]) => [...prev, upload]);
  };

  const removeUploadingEpisode = (id: string) => {
    setUploadingEpisodes((prev: EpisodeUploadProgress[]) =>
      prev.filter((upload) => upload.id !== id)
    );
  };

  // Handle add new movie
  const handleAddMovie = async (newMovie: Omit<Movie, "id">) => {
    const uploadId = `${newMovie.title}-${Date.now()}`;
    setUploadingMovies((prev) => [
      ...prev,
      { id: uploadId, title: newMovie.title, progress: 0 },
    ]);

    // Tính số bước: upload poster, upload trailer (nếu có) + gọi API thêm movie
    const totalSteps =
      (newMovie.poster && newMovie.poster instanceof File ? 1 : 0) +
      (newMovie.trailer && newMovie.trailer instanceof File ? 1 : 0) +
      1;
    const progressStep = 100 / totalSteps;
    let accumulatedProgress = 0;

    try {
      let posterUrl = newMovie.poster;
      if (newMovie.poster && newMovie.poster instanceof File) {
        posterUrl = await uploadFile(newMovie.title, newMovie.poster, "poster", (progress) => {
          const currentStepProgress = (progress * progressStep) / 100;
          updateUploadProgress(uploadId, accumulatedProgress + currentStepProgress);
        });
        accumulatedProgress += progressStep;
        updateUploadProgress(uploadId, accumulatedProgress);
      }

      let trailerUrl = newMovie.trailer;
      if (newMovie.trailer && newMovie.trailer instanceof File) {
        trailerUrl = await uploadFile(newMovie.title, newMovie.trailer, "trailer", (progress) => {
          const currentStepProgress = (progress * progressStep) / 100;
          updateUploadProgress(uploadId, accumulatedProgress + currentStepProgress);
        });
        accumulatedProgress += progressStep;
        updateUploadProgress(uploadId, accumulatedProgress);
      }

      const movieData = transformMovieToApi({
        ...newMovie,
        poster: posterUrl,
        trailer: trailerUrl,
      });
      if (!session?.token) return;
      const response = await axios.post(
        "http://localhost:5000/api/movies",
        JSON.stringify(movieData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          withCredentials: true,
        }
      );

      accumulatedProgress += progressStep;
      updateUploadProgress(uploadId, accumulatedProgress);
      updateUploadProgress(uploadId, 100);

      // Xoá progress sau khi hoàn tất upload
      setUploadingMovies((prev) =>
        prev.filter((upload) => upload.id !== uploadId)
      );

      const addedMovie = transformApiMovieToFrontend(response.data);
      setMovies((prevMovies) => [...prevMovies, addedMovie]);
      toast.success("Movie added successfully!");
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error("Failed to add movie.");
      setUploadingMovies((prev) =>
        prev.filter((upload) => upload.id !== uploadId)
      );
    }
  };

  const handleEditMovie = async (editedMovie: Omit<Movie, "id">) => {
    // Tương tự như handleAddMovie nhưng dành cho chỉnh sửa phim
  };

  const handleDeleteMovie = async (id: number) => {
    if (!session?.token) return;
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        withCredentials: true,
      });

      const movieToDelete = movies.find((movie) => movie.id === id);
      if (movieToDelete) {
        if (typeof movieToDelete.poster === "string") {
          const posterFileKey = `${movieToDelete.title}/${movieToDelete.poster.split("/").pop()}`;
          await axios.delete("http://localhost:5000/api/aws/file", {
            data: { fileKey: posterFileKey },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
          });
        }
        if (typeof movieToDelete.trailer === "string") {
          const trailerFileKey = `${movieToDelete.title}/${movieToDelete.trailer.split("/").pop()}`;
          await axios.delete("http://localhost:5000/api/aws/file", {
            data: { fileKey: trailerFileKey },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
          });
        }
      }

      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      toast.success("Movie deleted successfully!");
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie.");
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Toaster />
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Movies</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <MovieForm onSubmit={handleAddMovie} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-8">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Movie List</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Episodes</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell>{movie.genre}</TableCell>
                    <TableCell>{movie.year}</TableCell>
                    <TableCell>{movie.episodes}</TableCell>
                    <TableCell>{movie.views.toLocaleString()}</TableCell>
                    <TableCell>{movie.rating}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Edit</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Edit Movie</DialogTitle>
                            </DialogHeader>
                            <MovieForm movie={movie} onSubmit={handleEditMovie} />
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Episodes</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Manage Episodes</DialogTitle>
                            </DialogHeader>
                            <EpisodeManager
                              movieId={movie.id}
                              movieTitle={movie.title}
                              onEpisodeAdded={fetchMovies}
                              uploadingEpisodes={uploadingEpisodes}
                              updateEpisodeUploadProgress={updateEpisodeUploadProgress}
                              addUploadingEpisode={addUploadingEpisode}
                              removeUploadingEpisode={removeUploadingEpisode}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMovie(movie.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <section>
                <h3 className="font-semibold mb-2">Movies</h3>
                <ScrollArea className="h-[200px]">
                  {uploadingMovies.length === 0 ? (
                    <p className="text-muted-foreground">No movie uploads in progress.</p>
                  ) : (
                    uploadingMovies.map((upload) => (
                      <div key={upload.id} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{upload.title}</span>
                          <span className="text-sm font-medium">{Math.round(upload.progress)}%</span>
                        </div>
                        <Progress value={upload.progress} className="w-full" />
                      </div>
                    ))
                  )}
                </ScrollArea>
              </section>
              <section>
                <h3 className="font-semibold mb-2">Episodes</h3>
                <ScrollArea className="h-[200px]">
                  {uploadingEpisodes.length === 0 ? (
                    <p className="text-muted-foreground">No episode uploads in progress.</p>
                  ) : (
                    uploadingEpisodes.map((upload) => (
                      <div key={upload.id} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            {upload.movieTitle} - Episode {upload.episodeNumber}
                          </span>
                          <span className="text-sm font-medium">{Math.round(upload.progress)}%</span>
                        </div>
                        <Progress value={upload.progress} className="w-full" />
                      </div>
                    ))
                  )}
                </ScrollArea>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

//
// === MovieForm Component ===
//

function MovieForm({ movie, onSubmit }: MovieFormProps) {
  const [formData, setFormData] = useState<Omit<Movie, "id">>(
    movie || {
      title: "",
      genre: "",
      year: new Date().getFullYear(),
      episodes: 1,
      views: 0,
      rating: 0,
      summary: "",
      poster: null,
      trailer: null,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "episodes" || name === "views" || name === "rating"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Input id="genre" name="genre" value={formData.genre} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="episodes">Episodes</Label>
          <Input id="episodes" name="episodes" type="number" value={formData.episodes} onChange={handleChange} required />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="poster">Poster Image</Label>
          <Input id="poster" name="poster" type="file" accept="image/*" onChange={handleFileChange} />
          {formData.poster && typeof formData.poster !== "string" && (
            <div className="relative mt-2 h-40 w-full">
              <Image src={URL.createObjectURL(formData.poster as File)} alt="Movie Poster" fill className="object-contain" />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="trailer">Trailer Video</Label>
          <Input id="trailer" name="trailer" type="file" accept="video/*" onChange={handleFileChange} />
          {formData.trailer && typeof formData.trailer !== "string" && (
            <video controls className="mt-2 h-40 w-full">
              <source src={URL.createObjectURL(formData.trailer as File)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
      <Button type="submit">{movie ? "Update Movie" : "Add Movie"}</Button>
    </form>
  );
}

//
// === EpisodeManager Component ===
//

export interface EpisodeManagerProps {
  movieId: number;
  movieTitle: string;
  onEpisodeAdded: () => void;
  uploadingEpisodes: EpisodeUploadProgress[];
  updateEpisodeUploadProgress: (id: string, progress: number) => void;
  addUploadingEpisode: (upload: EpisodeUploadProgress) => void;
  removeUploadingEpisode: (id: string) => void;
}

export function EpisodeManager({
  movieId,
  movieTitle,
  onEpisodeAdded,
  uploadingEpisodes,
  updateEpisodeUploadProgress,
  addUploadingEpisode,
  removeUploadingEpisode,
}: EpisodeManagerProps) {
  const { data: session } = useSession();
  const [episodes, setEpisodes] = useState<ApiEpisode[]>([]);
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<ApiEpisode | null>(null);

  const fetchEpisodes = useCallback(async () => {
    try {
      if (!session?.token) return;
      const response = await axios.get(`http://localhost:5000/api/episodes/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      setEpisodes(response.data);
    } catch (error) {
      console.error("Error fetching episodes:", error);
      toast.error("Failed to fetch episodes.");
    }
  }, [movieId, session]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  const handleAddEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById("episodeVideo") as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select an episode file.");
      return;
    }

    const uploadId = `episode-${episodeNumber}-${Date.now()}`;
    // Thêm progress với movieTitle được truyền vào
    setIsAddDialogOpen(false);
    addUploadingEpisode({ id: uploadId, movieTitle, episodeNumber, progress: 0 });

    const totalSteps = 2; // 1 bước upload file + 1 bước gọi API
    const progressStep = 100 / totalSteps;
    let accumulatedProgress = 0;

    try {
      const file = fileInput.files[0];
      const finalUrl = await uploadEpisodeFile(movieTitle, episodeNumber, file, (progress) => {
        const currentStepProgress = (progress * progressStep) / 100;
        updateEpisodeUploadProgress(uploadId, accumulatedProgress + currentStepProgress);
      });

      accumulatedProgress += progressStep;
      updateEpisodeUploadProgress(uploadId, accumulatedProgress);

      if (!session?.token) return;
      const response = await axios.post(
        "http://localhost:5000/api/episodes",
        {
          movieId,
          videoUrl: finalUrl,
          episodeNumber: episodeNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      accumulatedProgress += progressStep;
      updateEpisodeUploadProgress(uploadId, accumulatedProgress);
      updateEpisodeUploadProgress(uploadId, 100);

      removeUploadingEpisode(uploadId);

      toast.success("Episode added successfully!");
      fetchEpisodes();
      setEpisodeNumber((prev) => prev + 1);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding episode:", error);
      toast.error("Failed to add episode.");
      removeUploadingEpisode(uploadId);
    }
  };

  const handlePreviewEpisode = (videoUrl: string | null) => {
    if (videoUrl) {
      setPreviewVideoUrl(videoUrl);
      setIsPreviewDialogOpen(true);
    } else {
      toast.error("Video URL is null.");
    }
  };

  const handleClosePreviewDialog = () => {
    setIsPreviewDialogOpen(false);
    setPreviewVideoUrl(null);
  };

  const handleDeleteEpisode = async (episodeId: number) => {
    try {
      if (!session?.token) return;
      await axios.delete(`http://localhost:5000/api/episodes/${episodeId}`, {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      const episodeToDelete = episodes.find((episode) => episode.id === episodeId);
      if (episodeToDelete && episodeToDelete.videoUrl) {
        const episodeFileKey = `${movieTitle}/${episodeToDelete.videoUrl.split("/").pop()}`;
        await axios.delete("http://localhost:5000/api/aws/file", {
          data: { fileKey: episodeFileKey },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        });
      }
      setEpisodes((prevEpisodes) => prevEpisodes.filter((episode) => episode.id !== episodeId));
      toast.success("Episode deleted successfully!");
    } catch (error) {
      console.error("Error deleting episode:", error);
      toast.error("Failed to delete episode.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Dialog Thêm tập phim */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>Add New Episode</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Episode</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEpisode} className="space-y-4">
            <div>
              <Label htmlFor="episodeNumber">Episode Number</Label>
              <Input
                id="episodeNumber"
                name="episodeNumber"
                type="number"
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="episodeVideo">Episode Video</Label>
              <Input id="episodeVideo" name="episodeVideo" type="file" accept="video/*" required />
            </div>
            <Button type="submit">Add Episode</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Preview Video */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={handleClosePreviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Episode</DialogTitle>
          </DialogHeader>
          {previewVideoUrl && (
            <div className="space-y-4">
              <video controls className="max-h-64 w-full">
                <source src={previewVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Danh sách tập phim */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="episodes">
          <AccordionTrigger>Episode List</AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Episode</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {episodes.map((episode) => (
                  <TableRow key={episode.id}>
                    <TableCell>{episode.episodeNumber}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewEpisode(episode.videoUrl)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditingEpisode(episode); setIsEditDialogOpen(true); }}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEpisode(episode.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
