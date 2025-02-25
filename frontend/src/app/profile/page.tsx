"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Camera,
  Film,
  Lock,
  User as UserIcon,
  Grid,
  List,
  X,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import axios from "axios";

interface RecentlyWatchedMovie {
  id: string;
  movieId: string;
  title: string;
  poster: string;
  progress: number;
}

interface WatchProgressSeries {
  id: string;
  title: string;
  season: number;
  episode: number;
  poster: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface FavoriteMovie {
  id: string;
  movieId: string;
}

interface Profile {
  full_name: string;
  email: string;
  avatar: string;
  subscription: string;
  favoriteGenres: string[];
  recentlyWatched: RecentlyWatchedMovie[];
  watchProgress: WatchProgressSeries[];
  achievements: Achievement[];
  favorites: FavoriteMovie[];
}

interface MovieDetail {
  id: number;
  title: string;
  posterUrl: string;
  summary: string;
  genre: string;
}

type ViewMode = "grid" | "list";
type SortBy = "newest" | "title";
type FilterBy = "all" | "action" | "sci-fi" | "drama" | "crime";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    full_name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    subscription: "Premium",
    favoriteGenres: ["Action", "Sci-Fi", "Drama"],
    recentlyWatched: [],
    watchProgress: [],
    achievements: [],
    favorites: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(profile.favorites);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filterBy, setFilterBy] = useState<FilterBy>("all");
  const [movieToRemove, setMovieToRemove] = useState<string | null>(null);
  const [movieDetails, setMovieDetails] = useState<Record<string, MovieDetail>>({});

  // State cho đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.token) return;
      try {
        const { data } = await axios.get("http://localhost:5000/api/customers/profile", {
          headers: { Authorization: `Bearer ${session.token}` },
          withCredentials: true,
        });
        setProfile((prev) => ({ ...prev, ...data }));
        setName(data.full_name || data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [session]);

  // Fetch watch histories (Recently Watched)
  useEffect(() => {
    const fetchWatchHistories = async () => {
      if (!session?.token) return;
      try {
        const { data } = await axios.get("http://localhost:5000/api/user-watch-histories", {
          headers: { Authorization: `Bearer ${session.token}` },
          withCredentials: true,
        });
        setProfile((prev) => ({ ...prev, recentlyWatched: data }));
      } catch (error) {
        console.error("Error fetching watch histories:", error);
      }
    };
    fetchWatchHistories();
  }, [session]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.token) return;
      try {
        const { data } = await axios.get("http://localhost:5000/api/user-favorites", {
          headers: { Authorization: `Bearer ${session.token}` },
          withCredentials: true,
        });
        setProfile((prev) => ({ ...prev, favorites: data }));
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, [session]);

  // Cập nhật movieDetails từ favorites và recentlyWatched
  useEffect(() => {
    const fetchMovieDetail = async (movieId: string) => {
      if (!session?.token) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/${movieId}`, {
          headers: { Authorization: `Bearer ${session.token}` },
          withCredentials: true,
        });
        return response.data as MovieDetail;
      } catch (error) {
        console.error(`Error fetching movie detail for movieId ${movieId}:`, error);
        return null;
      }
    };

    const updateMovieDetails = async () => {
      const details: Record<string, MovieDetail> = { ...movieDetails };
      const favIds = favorites.map((fav) => fav.movieId);
      const watchedIds = profile.recentlyWatched.map((rw) => rw.movieId);
      const allIds = Array.from(new Set([...favIds, ...watchedIds]));
      await Promise.all(
        allIds.map(async (id) => {
          if (!details[id]) {
            const detail = await fetchMovieDetail(id);
            if (detail) {
              details[id] = detail;
            }
          }
        })
      );
      setMovieDetails(details);
    };

    if (session?.token && (favorites.length > 0 || profile.recentlyWatched.length > 0)) {
      updateMovieDetails();
    }
  }, [favorites, profile.recentlyWatched, session]);

  // Xử lý xoá favourite: gọi API DELETE
  const handleDeleteFavorite = async (movieId: string) => {
    if (!session?.token) return;
    try {
      await axios.delete(`http://localhost:5000/api/user-favorites/movie/${movieId}`, {
        headers: { Authorization: `Bearer ${session.token}` },
        withCredentials: true,
      });
      // Sau khi xoá thành công, cập nhật lại favorites
      removeFromFavorites(movieId);
    } catch (error) {
      console.error(`Error deleting favorite for movieId ${movieId}:`, error);
    }
  };

  // Hàm xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    if (!session?.token) return;
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/customers/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          withCredentials: true,
        }
      );
      setPasswordMsg("Password changed successfully!");
      // Reset input fields
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  // Handler xoá favourite (gọi API DELETE)
  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((movie) => movie.movieId !== id));
    setProfile((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((movie) => movie.movieId !== id),
    }));
    setMovieToRemove(null);
  };

  // Sắp xếp và lọc favorites dựa trên thông tin chi tiết trong movieDetails
  const sortedAndFilteredFavorites = favorites
    .filter((fav) => {
      const detail = movieDetails[fav.movieId];
      if (!detail) return false;
      if (filterBy === "all") return true;
      return detail.genre.toLowerCase() === filterBy;
    })
    .sort((a, b) => {
      const detailA = movieDetails[a.movieId];
      const detailB = movieDetails[b.movieId];
      if (!detailA || !detailB) return 0;
      if (sortBy === "title") return detailA.title.localeCompare(detailB.title);
      return detailB.id - detailA.id;
    });

  return status === "loading" ? (
    <div>Loading...</div>
  ) : (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} alt={name} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-blue-500 hover:bg-blue-600">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-gray-400">{email}</p>
            </div>
          </div>
          <Button onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? "Save Profile" : "Edit Profile"}
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">
              <UserIcon className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Film className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Star className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Tab Account */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditMode} />
                </div>
                <div className="space-y-2">
                  <Label>Subscription Status</Label>
                  <p className="text-green-500 font-semibold">{profile.subscription}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Activity */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Watch Activity</CardTitle>
                <CardDescription>Your recently watched movies and ongoing series</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recently Watched</h3>
                  <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-700">
                    <div className="flex w-max space-x-4 p-4">
                      {profile.recentlyWatched.length > 0 ? (
                        profile.recentlyWatched.map((watch) => {
                          const detail = movieDetails[watch.movieId];
                          return (
                            <div key={watch.id} className="w-[150px] space-y-3">
                              <div className="overflow-hidden rounded-md">
                                {detail ? (
                                  <Image
                                    src={detail.posterUrl || "/placeholder.svg"}
                                    alt={detail.title || "Movie poster"}
                                    width={150}
                                    height={200}
                                    className="object-cover transition-all hover:scale-105 aspect-[3/4]"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full bg-gray-700">
                                    Loading...
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1 text-sm">
                                <h3 className="font-medium leading-none">
                                  {detail ? detail.title : "Loading..."}
                                </h3>
                                <p className="text-xs text-gray-400">Progress: {watch.progress}%</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>No watch history yet.</p>
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Continue Watching</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.watchProgress.length > 0 ? (
                      profile.watchProgress.map((series) => (
                        <Card key={series.id} className="bg-gray-800">
                          <CardContent className="p-0">
                            <div className="relative aspect-video">
                              <Image
                                src={series.poster || "/placeholder.svg"}
                                alt={series.title || "Series poster"}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-t-lg"
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold">{series.title}</h4>
                              <p className="text-sm text-gray-400">
                                Season {series.season}, Episode {series.episode}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p>No series in progress.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Favorites */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>My Favorites</CardTitle>
                <CardDescription>Manage your favorite movies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <Select onValueChange={(value) => setSortBy(value as SortBy)} defaultValue={sortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest Added</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setFilterBy(value as FilterBy)} defaultValue={filterBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="crime">Crime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1"}`}>
                  {favorites.length > 0 ? (
                    favorites
                      .filter((fav) => {
                        const detail = movieDetails[fav.movieId];
                        if (!detail) return false;
                        if (filterBy === "all") return true;
                        return detail.genre.toLowerCase() === filterBy;
                      })
                      .sort((a, b) => {
                        const detailA = movieDetails[a.movieId];
                        const detailB = movieDetails[b.movieId];
                        if (!detailA || !detailB) return 0;
                        if (sortBy === "title") return detailA.title.localeCompare(detailB.title);
                        return detailB.id - detailA.id;
                      })
                      .map((fav) => {
                        const detail = movieDetails[fav.movieId];
                        return (
                          <Card key={fav.movieId} className="bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
                            <CardContent className="p-0 relative">
                              <Link href={`/movie/${fav.movieId}`}>
                                <div className={`relative ${viewMode === "grid" ? "aspect-[2/3]" : "aspect-[16/9]"}`}>
                                  {detail ? (
                                    <Image
                                      src={detail.posterUrl || "/placeholder.svg"}
                                      alt={detail.title || "Movie poster"}
                                      fill
                                      style={{ objectFit: "cover" }}
                                      className="rounded-t-lg"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-700">
                                      Loading...
                                    </div>
                                  )}
                                </div>
                              </Link>
                              <div className="p-4">
                                <h3 className="font-semibold text-lg mb-1 truncate">
                                  {detail ? detail.title : "Loading..."}
                                </h3>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
                                onClick={() => handleDeleteFavorite(fav.movieId)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })
                  ) : (
                    <p>No favorite movies yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Security */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleChangePassword}>Change Password</Button>
                {passwordMsg && <p>{passwordMsg}</p>}
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                </div>
              </CardContent>
              <CardFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <AlertDialog open={!!movieToRemove} onOpenChange={() => setMovieToRemove(null)}>
          <AlertDialogContent className="bg-gray-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This will remove the movie from your favorites list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => movieToRemove && handleDeleteFavorite(movieToRemove)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
