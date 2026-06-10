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
    },
  },
  plugins: [],
};

export default config;
