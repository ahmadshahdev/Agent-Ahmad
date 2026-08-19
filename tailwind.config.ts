import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary / Accent Color Palette
        primary: {
          DEFAULT: "#4F46E5", // Indigo primary accent
          hover: "#4338CA",   // Hover state
          light: "#EEF2FF",   // Soft tinted backgrounds
          border: "#C7D2FE",  // Accent subtle borders
          bright: "#6366F1",  // Bright pop accent
        },
        // Neutral Dark Palette
        neutralDark: {
          DEFAULT: "#0F172A", // Slate 900 - Headings & primary text
          hover: "#1E293B",   // Slate 800
          muted: "#334155",   // Slate 700
        },
        // Neutral Light Palette
        neutralLight: {
          DEFAULT: "#F8FAFC", // Slate 50 - Background surfaces
          card: "#F1F5F9",    // Slate 100 - Card backgrounds
          border: "#E2E8F0",  // Slate 200 - Structure borders
          muted: "#64748B",   // Slate 500 - Subtitles & muted text
          lightMuted: "#94A3B8", // Slate 400
        },
        // Canvas & Base
        canvas: "#FAFAFC",
        surface: "#FFFFFF",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      spacing: {
        xs: "0.5rem",    // 8px
        sm: "0.75rem",   // 12px
        md: "1rem",      // 16px
        lg: "1.5rem",    // 24px
        xl: "2rem",      // 32px
        "2xl": "3rem",   // 48px
        "3xl": "4rem",   // 64px
        section: "5rem", // 80px
      },
      borderRadius: {
        sm: "0.375rem",  // 6px
        md: "0.5rem",    // 8px
        lg: "0.75rem",   // 12px
        xl: "1rem",      // 16px
        "2xl": "1.5rem", // 24px
        full: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px 0 rgba(15, 23, 42, 0.02)",
        card: "0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -1px rgba(15, 23, 42, 0.03)",
        "card-hover": "0 10px 25px -5px rgba(79, 70, 229, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
        floating: "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.03)",
        "agent-glow": "0 0 20px -3px rgba(79, 70, 229, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
