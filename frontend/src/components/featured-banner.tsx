"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Play, Film } from "lucide-react"

// Define the type for our featured movie
type FeaturedMovie = {
  id: number
  title: string
  description: string
  imageUrl: string
}

// Sample data for featured movies
const featuredMovies: FeaturedMovie[] = [
  {
    id: 1,
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    imageUrl: "/feature_banner.png",
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    imageUrl: "/phim4.jpg",
  },
  {
    id: 3,
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imageUrl: "/sign_in_bg.png",
  },
]

export default function FeaturedBanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
    dotsClass: "slick-dots !bottom-5",
    customPaging: () => <div className="w-2 h-2 mx-1 rounded-full bg-white/50 hover:bg-white/80 transition-all" />,
  }

  return (
    <div className="relative w-full">
      <Slider {...settings} className="[&_.slick-slide]:relative [&_.slick-slide]:block [&_.slick-track]:flex">
        {featuredMovies.map((movie) => (
          <div key={movie.id} className="relative w-full">
            {/* Responsive height container */}
            <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full">
              <Image
                src={movie.imageUrl || "/placeholder.svg"}
                alt={movie.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                quality={90}
              />
              {/* Gradient overlays - Adjusted for better bottom content visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
            </div>

            {/* Content container - Moved closer to bottom */}
            <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 md:pb-24">
              <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 space-y-2 sm:space-y-3 md:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{movie.title}</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-[90%] md:max-w-[70%] lg:max-w-[50%] line-clamp-2 sm:line-clamp-3">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button size="sm" className="sm:text-base md:text-lg h-9 sm:h-10 md:h-11">
                    <Play className="mr-2 h-4 w-4" />
                    Xem ngay
                  </Button>
                  <Button variant="outline" size="sm" className="sm:text-base md:text-lg h-9 sm:h-10 md:h-11">
                    <Film className="mr-2 h-4 w-4" />
                    Xem trailer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

