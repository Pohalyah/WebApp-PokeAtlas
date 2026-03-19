import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"]
      },
      boxShadow: {
        float: "0 24px 60px -26px rgba(15, 23, 42, 0.28)",
        card: "0 18px 48px -26px rgba(15, 23, 42, 0.18)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.16) 1px, transparent 0)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        floatIn: "floatIn 500ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
