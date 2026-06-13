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
          DEFAULT: "#76536E",
          50: "#F7F2F6",
          100: "#EDE2EB",
          200: "#D9C5D5",
          300: "#BE9DB7",
          400: "#9D7594",
          500: "#76536E",
          600: "#64445D",
          700: "#52364C",
          800: "#422C3D",
          900: "#30202C",
        },
        ivory: "#F7F2E8",
        paper: "#FCF9F2",
        ink: "#29241F",
        sage: "#81907A",
        clay: "#B97861",
        sand: "#E7DAC4",
        lavender: "#D8C9D8",
      },
      fontFamily: {
        sans: ["Aptos", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "Iowan Old Style",
          "Baskerville",
          "Palatino Linotype",
          "Book Antiqua",
          "Georgia",
          "serif",
        ],
        hand: ["Segoe Print", "Bradley Hand", "Comic Sans MS", "cursive"],
      },
      boxShadow: {
        soft: "0 2px 2px rgba(41, 36, 31, 0.03), 0 10px 30px rgba(41, 36, 31, 0.07)",
        paper: "0 1px 0 rgba(255,255,255,.9) inset, 0 2px 4px rgba(41,36,31,.08), 0 18px 40px rgba(41,36,31,.07)",
        lift: "0 5px 10px rgba(41,36,31,.08), 0 24px 55px rgba(41,36,31,.12)",
      },
    },
  },
  plugins: [],
};

export default config;
