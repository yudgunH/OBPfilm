import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { ClientProviders } from "@/app/providers/ClientProviders";
import LayoutWrapper from "@/app/LayoutWrapper";
import type React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AllDrama Movies",
  description: "Watch the latest drama films",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClientProviders>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
