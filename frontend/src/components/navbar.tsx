"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation"; // Thêm usePathname

const genres = [
  { name: "Action", slug: "action" },
  { name: "Romance", slug: "romance" },
  { name: "Science Fiction", slug: "sci-fi" },
  { name: "Comedy", slug: "comedy" },
  { name: "Drama", slug: "drama" },
  { name: "Adventure", slug: "adventure" },
  { name: "Thriller", slug: "thriller" },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const isHome = pathname === "/"; // Chỉ trang chủ

  // Hàm xử lý tìm kiếm: chuyển hướng sang trang search với query từ input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => signOut();

  return (
    <nav
      className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        isHome ? "sticky top-0 z-50" : ""
      } w-full border-b border-border/40`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="cursor-pointer"
              />
            </Link>
            {/* Phần Navigation menu cho desktop */}
            {!isSmallScreen && (
              <NavigationMenu className="ml-6">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Genre</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {genres.map((genre) => (
                          <li key={genre.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={`/search?genre=${encodeURIComponent(genre.slug)}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                {genre.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
          {/* Menu cho màn hình nhỏ */}
          {isSmallScreen ? (
            <div ref={dropdownRef}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border">
                  <div className="py-1">
                    <Link
                      href="/genre"
                      className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      Genre
                    </Link>
                    <div className="px-4 py-2">
                      <form onSubmit={handleSearch} className="w-full">
                        <Input
                          type="search"
                          placeholder="Tìm kiếm phim..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </form>
                    </div>
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Log out
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/sign-in"
                          className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          Login
                        </Link>
                        <Link
                          href="/sign-up"
                          className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pr-8"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={"/placeholder-avatar.jpg"}
                          alt="User avatar"
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href="/profile">
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                      </Link>
                      <Link href="/settings">
                        <DropdownMenuItem>Setting</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/sign-in">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Register</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
