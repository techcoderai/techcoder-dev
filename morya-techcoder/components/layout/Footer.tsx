import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail, ArrowUpRight } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "All Posts" },
      { href: "/blog?category=AI", label: "AI & ML" },
      { href: "/blog?category=WebDev", label: "Engineering" },
      { href: "/blog?category=Tricks", label: "Tips & Tricks" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Tutorials" },
      { href: "/blog", label: "Learning Paths" },
      { href: "/blog?category=Tricks", label: "Code Snippets" },
      { href: "/blog", label: "Newsletter" },
    ],
  },
];

const socials = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-4 border-t border-tc-border bg-tc-bg-secondary">
      <div className="container-wide mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 max-w-sm">
            <Link href="/" className="focus-ring rounded-lg inline-flex items-center gap-2.5 mb-5 group">
              <Image src="/icon.png" alt="TechCoder" width={34} height={34} className="rounded-xl" />
              <span className="font-heading text-lg font-bold tracking-tight text-tc-text">
                Tech<span className="text-gradient">Coder</span>
              </span>
            </Link>
            <p className="body-sm max-w-xs">
              A developer publication with in-depth articles, hands-on tutorials, and
              copy-paste code snippets. Learn, build, and grow as a developer.
            </p>
            <div className="flex gap-2.5 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="focus-ring flex items-center justify-center w-10 h-10 rounded-xl border border-tc-border bg-tc-bg-card text-tc-text-muted hover:text-white hover:border-transparent hover:bg-gradient-to-br hover:from-tc-primary hover:to-tc-secondary transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="overline text-tc-text-light mb-4">{col.title}</h4>
              <nav className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="focus-ring group inline-flex items-center gap-1 text-sm text-tc-text-muted hover:text-tc-primary transition-colors duration-200 w-fit"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-tc-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-tc-text-light">
            &copy; {new Date().getFullYear()} TechCoder. Crafted with Next.js & Tailwind CSS.
          </p>
          <p className="text-xs text-tc-text-light flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New articles every week
          </p>
        </div>
      </div>
    </footer>
  );
}
