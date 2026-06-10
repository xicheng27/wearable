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
          DEFAULT: "#1D9E75",
          50: "#E8F7F2",
          100: "#C5EBD9",
          200: "#8FD5B8",
          300: "#59C097",
          400: "#2EAB82",
          500: "#1D9E75",
          600: "#178560",
          700: "#116B4E",
          800: "#0C523B",
          900: "#073829",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06)",
        lift: "0 4px 8px rgba(16, 24, 40, 0.05), 0 16px 40px rgba(16, 24, 40, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
