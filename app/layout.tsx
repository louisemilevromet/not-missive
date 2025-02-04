import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/app/components/providers/convex-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { SyncUserWithClerk } from "@/app/components/SyncUserWithClerk";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Not Missive",
  description: "Not Missive | Fake chat app",
  icons: {
    icon: [
      { url: "/assets/favicon.ico", sizes: "32x32" },
      { url: "/assets/icon.png", sizes: "192x192" },
    ],
    apple: [{ url: "/assets/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Louis-Émile Vromet | Portfolio",
    description: "Louis-Émile Vromet | Portfolio",
    url: "https://vromet-portfolio-real.vercel.app/en",
    siteName: "Louis-Émile Vromet | Portfolio",
    images: [
      {
        url: "/assets/icon.png",
        width: 192,
        height: 192,
        alt: "Icône de Louis-Émile Vromet",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Louis-Émile Vromet | Portfolio",
    description: "Louis-Émile Vromet | Portfolio",
    images: ["/assets/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <SyncUserWithClerk />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
