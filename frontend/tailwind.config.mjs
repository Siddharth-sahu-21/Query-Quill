/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
      animation: {
        gradient: "gradient 15s ease infinite",
        "draw-1": "draw 8s ease-in-out infinite",
        "draw-2": "draw 8s ease-in-out infinite 1s",
        "draw-3": "draw 8s ease-in-out infinite 2s",
        "float-slow": "float 10s ease-in-out infinite",
        "float-delay": "float 8s ease-in-out infinite 2s",
        "pulse-slow": "pulse 12s ease-in-out infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.05)" },
        },
        draw: {
          "0%": { "stroke-dashoffset": "1000", "stroke-dasharray": "1000" },
          "45%": { "stroke-dashoffset": "0", "stroke-dasharray": "1000" },
          "55%": { "stroke-dashoffset": "0", "stroke-dasharray": "1000" },
          "100%": { "stroke-dashoffset": "-1000", "stroke-dasharray": "1000" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.1" },
          "50%": { transform: "scale(1.2)", opacity: "0.2" },
        },
      },
    },
  },
  plugins: [],
};
