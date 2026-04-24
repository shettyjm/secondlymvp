import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f2540",
        ocean: "#184c73",
        teal: "#4c8a8b",
        mist: "#eef5f7",
        sand: "#f7fafb",
        line: "#d9e7eb",
      },
      boxShadow: {
        card: "0 20px 60px -32px rgba(15, 37, 64, 0.28)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
