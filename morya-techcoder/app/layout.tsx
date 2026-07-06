import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techcoder.dev"),
  title: "TechCoder | Learn, Build & Grow as a Developer",
  description:
    "TechCoder is a developer publication with in-depth articles, hands-on tutorials, and copy-paste code snippets across AI, web engineering, and developer tooling.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

// Runs before paint to prevent a flash of the wrong theme.
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('tc-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col relative">
        {/* Global ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-60" />
          <div
            className="absolute -top-40 right-[-10%] w-[640px] h-[640px] rounded-full opacity-50 blur-[130px] animate-pulse-glow"
            style={{ background: "var(--tc-glow)" }}
          />
          <div
            className="absolute top-[40%] left-[-15%] w-[520px] h-[520px] rounded-full opacity-35 blur-[140px] animate-float-slow"
            style={{ background: "var(--tc-glow-soft)" }}
          />
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
