import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Bot, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface border-t border-neutralLight-border mt-auto">
      <div className="max-w-7xl mx-auto px-md sm:px-lg lg:px-xl py-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl pb-lg border-b border-neutralLight-border">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-sm">
            <Link href="/" className="flex items-center gap-xs">
              <div className="w-8 h-8 rounded-lg bg-primary-light border border-primary-border flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xl text-neutralDark">
                {siteConfig.name}
              </span>
            </Link>
            <p className="font-body text-sm text-neutralLight-muted max-w-sm">
              {siteConfig.tagline}
            </p>
            <div className="flex items-center gap-xs text-xs font-body text-neutralDark-muted bg-neutralLight-card px-sm py-1 rounded-full w-fit border border-neutralLight-border">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Interactive AI portfolio enabled by {siteConfig.agentName}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-sm">
            <h3 className="font-heading font-semibold text-sm text-neutralDark tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="space-y-xs">
              {siteConfig.navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-neutralLight-muted hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-sm">
            <h3 className="font-heading font-semibold text-sm text-neutralDark tracking-wider uppercase">
              Connect
            </h3>
            <div className="flex items-center gap-sm">
              {/* GitHub SVG */}
              <a
                href={siteConfig.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-9 h-9 rounded-md bg-neutralLight border border-neutralLight-border flex items-center justify-center text-neutralDark hover:bg-primary-light hover:text-primary hover:border-primary-border transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn SVG */}
              <a
                href={siteConfig.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-md bg-neutralLight border border-neutralLight-border flex items-center justify-center text-neutralDark hover:bg-primary-light hover:text-primary hover:border-primary-border transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Twitter / X SVG */}
              <a
                href={siteConfig.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X Profile"
                className="w-9 h-9 rounded-md bg-neutralLight border border-neutralLight-border flex items-center justify-center text-neutralDark hover:bg-primary-light hover:text-primary hover:border-primary-border transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href={siteConfig.socialLinks.email}
                aria-label="Send Email"
                className="w-9 h-9 rounded-md bg-neutralLight border border-neutralLight-border flex items-center justify-center text-neutralDark hover:bg-primary-light hover:text-primary hover:border-primary-border transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-md flex flex-col sm:flex-row items-center justify-between gap-sm text-xs font-body text-neutralLight-muted">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <span className="font-bold text-red-600 text-xs px-2.5 py-0.5 bg-red-50 border border-red-200 rounded-full inline-flex items-center gap-1">
            ⚠️ Notice: Contains Dummy Data
          </span>
          <p className="flex items-center gap-1">
            Built with Next.js 14, Tailwind CSS & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
