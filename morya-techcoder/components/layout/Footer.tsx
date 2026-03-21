import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-tc-bg-card border-t border-gray-200">
      <div className="container-wide mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <div>
            <Link href="/" className="focus-ring rounded-lg inline-flex items-center gap-2 mb-4 group">
              <Image
                src="/icon.png"
                alt="TechCoder mascot"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-heading text-lg font-extrabold tracking-tight text-tc-text">
                Tech<span className="text-tc-primary">Coder</span>
              </span>
            </Link>
            <p className="text-sm text-tc-text-muted leading-relaxed max-w-xs">
              Your daily source for AI insights, web development tutorials, and developer productivity tricks.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="overline text-tc-text-light mb-4">Explore</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/blog", label: "All Posts" },
                { href: "/blog?category=AI", label: "AI & ML" },
                { href: "/blog?category=WebDev", label: "Web Dev" },
                { href: "/blog?category=Tricks", label: "Tips & Tricks" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="focus-ring rounded text-sm text-tc-text-muted hover:text-tc-primary transition-colors duration-200 w-fit relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-tc-primary after:rounded-full after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="overline text-tc-text-light mb-4">Connect</h4>
            <div className="flex gap-2.5">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="focus-ring flex items-center justify-center w-10 h-10 rounded-xl bg-tc-bg-elevated text-tc-text-muted hover:bg-tc-primary hover:text-white active:bg-tc-primary-dark transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:translate-y-0"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-tc-text-light">
            &copy; {new Date().getFullYear()} TechCoder. Built with Next.js & Tailwind CSS.
          </p>
          <p className="text-xs text-tc-text-light">
            Made with passion for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
