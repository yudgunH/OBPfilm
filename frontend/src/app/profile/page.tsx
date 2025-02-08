"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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
} from "@/components/ui/alert-dialog"
import { Camera, Edit, Film, Lock, Settings, User, Grid, List, X, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import Link from "next/link"

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  subscription: "Premium",
  favoriteGenres: ["Action", "Sci-Fi", "Drama"],
  recentlyWatched: [
    { id: "1", title: "Inception", poster: "/placeholder.svg?height=300&width=200&text=Inception", progress: 100 },
    { id: "2", title: "The Matrix", poster: "/placeholder.svg?height=300&width=200&text=The+Matrix", progress: 75 },
    { id: "3", title: "Interstellar", poster: "/placeholder.svg?height=300&width=200&text=Interstellar", progress: 50 },
    {
      id: "4",
      title: "The Dark Knight",
      poster: "/placeholder.svg?height=300&width=200&text=The+Dark+Knight",
      progress: 25,
    },
    { id: "5", title: "Pulp Fiction", poster: "/placeholder.svg?height=300&width=200&text=Pulp+Fiction", progress: 10 },
  ],
  watchProgress: [
    {
      id: "6",
      title: "Stranger Things",
      season: 2,
      episode: 5,
      poster: "/placeholder.svg?height=300&width=200&text=Stranger+Things",
    },
    {
      id: "7",
      title: "Breaking Bad",
      season: 3,
      episode: 7,
      poster: "/placeholder.svg?height=300&width=200&text=Breaking+Bad",
    },
  ],
  achievements: [
    { id: "1", name: "Movie Buff", description: "Watched 100 movies", icon: "🎬" },
    { id: "2", name: "Binge Watcher", description: "Completed a TV series in one day", icon: "📺" },
    { id: "3", name: "Critic", description: "Wrote 50 reviews", icon: "✍️" },
  ],
  favorites: [
    { id: "1", title: "Inception", genre: "Sci-Fi", poster: "/placeholder.svg?height=400&width=300&text=Inception" },
    {
      id: "2",
      title: "The Dark Knight",
      genre: "Action",
      poster: "/placeholder.svg?height=400&width=300&text=The+Dark+Knight",
    },
    {
      id: "3",
      title: "Pulp Fiction",
      genre: "Crime",
      poster: "/placeholder.svg?height=400&width=300&text=Pulp+Fiction",
    },
    {
      id: "4",
      title: "Forrest Gump",
      genre: "Drama",
      poster: "/placeholder.svg?height=400&width=300&text=Forrest+Gump",
    },
    { id: "5", title: "The Matrix", genre: "Sci-Fi", poster: "/placeholder.svg?height=400&width=300&text=The+Matrix" },
  ],
}

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [favorites, setFavorites] = useState(user.favorites)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [movieToRemove, setMovieToRemove] = useState<string | null>(null)

  const removeFromFavorites = (id: string) => {
    setFavorites(favorites.filter((movie) => movie.id !== id))
    setMovieToRemove(null)
  }

  const sortedAndFilteredFavorites = favorites
    .filter((movie) => filterBy === "all" || movie.genre.toLowerCase() === filterBy)
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return Number.parseInt(b.id) - Number.parseInt(a.id)
    })

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-blue-500 hover:bg-blue-600">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <Button onClick={() => setIsEditMode(!isEditMode)}>{isEditMode ? "Save Profile" : "Edit Profile"}</Button>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Film className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Star className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
          </TabsList>

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
                  <p className="text-green-500 font-semibold">{user.subscription}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                      {user.recentlyWatched.map((movie) => (
                        <div key={movie.id} className="w-[150px] space-y-3">
                          <div className="overflow-hidden rounded-md">
                            <Image
                              src={movie.poster || "/placeholder.svg"}
                              alt={movie.title}
                              width={150}
                              height={200}
                              className="object-cover transition-all hover:scale-105 aspect-[3/4]"
                            />
                          </div>
                          <div className="space-y-1 text-sm">
                            <h3 className="font-medium leading-none">{movie.title}</h3>
                            <p className="text-xs text-gray-400">Progress: {movie.progress}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Continue Watching</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {user.watchProgress.map((series) => (
                      <Card key={series.id} className="bg-gray-800">
                        <CardContent className="p-0">
                          <div className="relative aspect-video">
                            <Image
                              src={series.poster || "/placeholder.svg"}
                              alt={series.title}
                              layout="fill"
                              objectFit="cover"
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
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Change Password</Button>
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
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your movie-watching experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Favorite Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.favoriteGenres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Genres
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <select id="language" className="w-full p-2 rounded bg-gray-800 border border-gray-700">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable Email Notifications</Label>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your movie-watching milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {user.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>My Favorites</CardTitle>
                <CardDescription>Manage your favorite movies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <Select onValueChange={setSortBy} defaultValue={sortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest Added</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setFilterBy} defaultValue={filterBy}>
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
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div
                  className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1"}`}
                >
                  {sortedAndFilteredFavorites.map((movie) => (
                    <Card
                      key={movie.id}
                      className="bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      <CardContent className="p-0 relative">
                        <Link href={`/movie/${movie.id}`}>
                          <div className={`relative ${viewMode === "grid" ? "aspect-[2/3]" : "aspect-[16/9]"}`}>
                            <Image
                              src={movie.poster || "/placeholder.svg"}
                              alt={movie.title}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-t-lg"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1 truncate">{movie.title}</h3>
                          <p className="text-sm text-gray-400">{movie.genre}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full"
                          onClick={() => setMovieToRemove(movie.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <AlertDialog open={!!movieToRemove} onOpenChange={() => setMovieToRemove(null)}>
          <AlertDialogContent className="bg-gray-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This will remove the movie from your favorites list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setMovieToRemove(null)}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => movieToRemove && removeFromFavorites(movieToRemove)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

