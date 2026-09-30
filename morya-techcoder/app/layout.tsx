import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { DM_Sans, Montserrat } from "next/font/google";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TechCoder | Technology Knowledge You Can Trust",
  description:
    "TechCoder is a premium technology publication with in-depth articles, hands-on guides, and honest reviews across programming, AI, technology, and gadgets.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "TechCoder",
    title: "TechCoder | Technology Knowledge You Can Trust",
    description:
      "In-depth articles, hands-on guides, and honest reviews across programming, AI, technology, and gadgets.",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechCoder | Technology Knowledge You Can Trust",
    description:
      "In-depth articles, hands-on guides, and honest reviews across programming, AI, technology, and gadgets.",
    images: [DEFAULT_OG_IMAGE.url],
  },
  icons: {
    icon: "/favicon.svg",
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
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${dmSans.variable} h-full antialiased`}
    >
      {/*
        Theme bootstrap lives in <body>, not a manual <head>.
        App Router owns <head> via the Metadata API; putting an inline script
        there fights browser extensions that inject <script> tags into <head>
        before hydration (shows up as a false themeScript mismatch).
      */}
      <body suppressHydrationWarning className="min-h-full antialiased">
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
