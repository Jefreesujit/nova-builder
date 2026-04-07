import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NovaBuilder - The Open Source AI App Builder",
  description:
    "Build beautiful web applications with AI. The open-source alternative to Lovable, v0, and Bolt.new. No vendor lock-in, bring your own API keys.",
  keywords: [
    "AI",
    "app builder",
    "web development",
    "open source",
    "React",
    "Next.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
