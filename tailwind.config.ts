import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#09090b",
        surface: "#18181b",
        border: "rgba(255,255,255,0.08)",
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
        },
        accent: "#a5b4fc",
        success: "#10b981",
        warning: "#f59e0b",
        muted: "#71717a",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
