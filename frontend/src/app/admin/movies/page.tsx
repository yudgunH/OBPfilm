"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const initialMovies = [
  { id: 1, title: "Inception", genre: "Sci-Fi", releaseDate: "2010-07-16", status: "Published" },
  { id: 2, title: "The Shawshank Redemption", genre: "Drama", releaseDate: "1994-09-23", status: "Published" },
  { id: 3, title: "The Dark Knight", genre: "Action", releaseDate: "2008-07-18", status: "Published" },
  { id: 4, title: "Pulp Fiction", genre: "Crime", releaseDate: "1994-10-14", status: "Draft" },
  { id: 5, title: "Forrest Gump", genre: "Drama", releaseDate: "1994-07-06", status: "Published" },
]

export default function MoviesPage() {
  const [movies, setMovies] = useState(initialMovies)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMovie, setNewMovie] = useState({ title: "", genre: "", releaseDate: "", status: "Draft" })

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddMovie = () => {
    setMovies([...movies, { ...newMovie, id: movies.length + 1 }])
    setNewMovie({ title: "", genre: "", releaseDate: "", status: "Draft" })
  }

  const handleDeleteMovie = (id: number) => {
    setMovies(movies.filter((movie) => movie.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Movies</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Movie</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
              <DialogDescription>Enter the details of the new movie.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="genre" className="text-right">
                  Genre
                </Label>
                <Input
                  id="genre"
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="releaseDate" className="text-right">
                  Release Date
                </Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={newMovie.releaseDate}
                  onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMovie}>Add Movie</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Release Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMovies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.genre}</TableCell>
              <TableCell>{movie.releaseDate}</TableCell>
              <TableCell>{movie.status}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleDeleteMovie(movie.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

