import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function FeaturedBanner() {
  return (
    <div className="relative h-[80vh] w-full">
      <Image
        src="/feature_banner.png?height=1080&width=1920"
        alt="Featured Movie"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-0 left-0 p-8">
        <h2 className="text-5xl font-bold mb-2">Bước đến bên em</h2>
        <p className="text-lg mb-4 max-w-xl">Chàng trai phải bước 1000 bước để đến bên cô gái</p>
        <div className="space-x-4">
          <Button>Xem ngay</Button>
          <Button variant="outline">Xem trailer</Button>
        </div>
      </div>
    </div>
  )
}

