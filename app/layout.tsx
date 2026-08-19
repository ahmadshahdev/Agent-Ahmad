import type { Metadata } from "next";
import { fontHeading, fontBody } from "@/lib/fonts";
import { siteConfig } from "@/config/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  authors: [{ name: siteConfig.name }],
  keywords: [
    "Ahmad",
    "Portfolio",
    "Full-Stack Developer",
    "AI Engineer",
    "Next.js",
    "Agent Ahmad",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-canvas text-neutralDark font-body antialiased selection:bg-primary-light selection:text-primary">
        <Nav />
        <main className="flex-1 w-full max-w-7xl mx-auto px-md sm:px-lg lg:px-xl py-lg">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
