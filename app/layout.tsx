import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Tværstræde 12 – Projektoverblik",
  description: "Opgaver og budget for renoveringen af Tværstræde 12",
  // Gør det muligt at "installere" siden på iPhone-hjemskærmen som en app
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tværstræde 12",
  },
};

export const viewport: Viewport = {
  themeColor: "#B5502E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body`}
      >
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 px-5 py-8 md:px-10 md:py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
