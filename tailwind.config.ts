import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0614",
          900: "#120B22",
          800: "#1C1230",
        },
        brand: {
          DEFAULT: "#7C3AED",
          light: "#A855F7",
          dark: "#5B21B6",
          soft: "#F1EBFB",
          softer: "#F8F5FE",
        },
        heading: "#241242",
        warn: {
          DEFAULT: "#EF4444",
          soft: "#FDECEC",
        },
        band: {
          purple: "#C9B8EF",
          orange: "#F3B98D",
          green: "#A9D8AC",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(120% 100% at 50% 0%, #3B1E68 0%, #180C2C 45%, #0B0614 100%)",
        "brand-gradient": "linear-gradient(90deg, #6D28D9 0%, #9333EA 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.8s ease forwards",
        twinkle: "twinkle 3s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
