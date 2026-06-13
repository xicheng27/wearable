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
        primary: {
          DEFAULT: "#6D28D9",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        // Warm-cool "paper" surface tinted toward the iris accent —
        // calmer than stark grey, distinct from a clinical white.
        surface: "#F4F3F8",
        line: "#EAE7F2",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20, 18, 40, 0.04), 0 10px 30px rgba(20, 18, 40, 0.06)",
        lift: "0 2px 6px rgba(20, 18, 40, 0.06), 0 18px 44px rgba(20, 18, 40, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
