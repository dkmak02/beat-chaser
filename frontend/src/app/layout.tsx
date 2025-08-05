import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameConfigProvider } from "@/contexts/GameConfigContext";
import { UserProvider } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beat Chaser - Music Guessing Game",
  description: "Test your music knowledge with our interactive guessing game!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <UserProvider>
          <GameConfigProvider>
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </GameConfigProvider>
        </UserProvider>
      </body>
    </html>
  );
}
