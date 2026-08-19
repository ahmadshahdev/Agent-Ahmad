export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Ahmad",
  title: "Ahmad | Full-Stack Engineer & AI Developer",
  tagline: "Building intelligent web applications & AI agent experiences",
  description:
    "Personal portfolio & interactive AI agent showcase for Ahmad, Full-Stack Engineer & AI Systems Specialist.",
  agentName: "Agent Ahmad",
  availableForWork: true,
  url: "https://agent-ahmad.vercel.app",
  socialLinks: {
    github: "https://github.com/ahmadshahdev",
    linkedin: "https://linkedin.com/in/ahmad",
    twitter: "https://twitter.com/ahmad_dev",
    email: "mailto:ahmad@example.com",
  },
  navLinks: [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Resume", href: "/resume" },
    { name: "Architecture", href: "/blog/how-i-built-this" },
  ],
};
