/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sampled directly from the Zeonix eCards logo mark
        ink: {
          DEFAULT: "#0C2521",
          soft: "#123430",
          line: "#1E3B35",
        },
        brand: {
          DEFAULT: "#81BE46", // logo's Z-mark green
          deep: "#4C7A26", // accessible text/link/button shade
          bright: "#9BD35E", // hover highlight on dark surfaces
          soft: "#EEF6E4", // faint tint for badges & soft surfaces
        },
        paper: {
          DEFAULT: "#FCFDFC",
          dim: "#F2F5F0",
        },
        stone: "#5C6B63",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      maxWidth: {
        content: "1240px",
      },
      boxShadow: {
        card: "0 24px 60px -24px rgba(12, 37, 33, 0.35)",
        soft: "0 12px 32px -16px rgba(12, 37, 33, 0.18)",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-9px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        drift: "drift 6s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

