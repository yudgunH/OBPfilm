"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import MovieCard from "./movie-card"
import MovieCardSkeleton from "./movie-card-skeleton"
import { Button } from "@/components/ui/button"

interface Movie {
  id: string
  title: string
  poster: string
  rating: number
  year: number
  genre: string
}

interface MovieListProps {
  title: string
  category: string
}

export default function MovieList({ title, category }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchMovies = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    // Giả lập API với setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Tạo dữ liệu phim giả lập
    const newMovies = Array.from({ length: 5 }, () => ({
      id: uuidv4(),
      title: `Movie ${Math.random().toString(36).substring(7)}`,
      poster: `/phim1.jpg?height=950&width=300&text=Movie`,
      rating: 4,
      year: 2023,
      genre: "Action",
    }))

    // Cập nhật danh sách phim, tránh trùng lặp ID
    setMovies((prevMovies) => [...prevMovies, ...newMovies])
    setPage((prevPage) => prevPage + 1)
    setLoading(false)
    setLoadingMore(false)
  }

  useEffect(() => {
    fetchMovies(true)
  }, []) // Chạy một lần khi component mount

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => <MovieCardSkeleton key={index} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
      {loadingMore && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <MovieCardSkeleton key={`more-${index}`} />
          ))}
        </div>
      )}
      {!loading && !loadingMore && (
        <div className="text-center mt-4">
          <Button onClick={() => fetchMovies()}>Xem thêm</Button>
        </div>
      )}
    </section>
  )
}

