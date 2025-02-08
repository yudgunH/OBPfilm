"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface MovieCardProps {
  movie: {
    id: string
    title: string
    poster: string
    rating: number
    year: number
    genre: string
  }
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="relative overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <Image
          src={movie.poster || "/placeholder.svg"}
          alt={movie.title}
          width={300}
          height={450}
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold mb-1">{movie.title}</h3>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p className="text-sm mb-2">
                {movie.year} • {movie.genre}
              </p>
              <Link href={`/movie/${movie.id}`}>
                <Button size="sm" className="w-full">
                  Xem ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

