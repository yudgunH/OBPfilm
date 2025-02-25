import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"
export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image src="/logo.png" alt="Logo" width={170} height={40} />
            </div>
            <p className="text-sm text-muted-foreground">
              Enjoy the best movie viewing experience with high quality and diverse content.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/new-movies" className="text-sm hover:underline">
                  New Movies
                </Link>
              </li>
              <li>
                <Link href="/hot-movies" className="text-sm hover:underline">
                  Hot Movies
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-sm hover:underline">
                  Genres
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect with us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground hover:text-primary">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-foreground hover:text-primary">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AllDrama. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

