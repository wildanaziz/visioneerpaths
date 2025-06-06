import type { Metadata } from "next";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { Navbar } from "@/components/navbar";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import "@/styles/globals.css";

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Visioneer Homebase",
  description:
    "Welcome to Visioneer Homebase, your gateway to the world of computer vision research and development. Explore our resources, projects, and community-driven initiatives to enhance your understanding and skills in computer vision.",
  icons: {
    icon: "/favicon.ico", // Updated to include leading slash for correct path
  },
  openGraph: {
    title: "Visioneer Homebase",
    description:
      "Welcome to Visioneer Homebase, your gateway to the world of computer vision research and development. Explore our resources, projects, and community.",
    images: [
      {
        url: "/opengraph-image.jpg", 
        width: 1477,
        height: 812,
        alt: "Visioneer Homebase Banner",
      },
    ],
    url: "https://visioneerpaths.vercel.app", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="sm:container mx-auto w-[90vw] h-auto scroll-smooth">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}