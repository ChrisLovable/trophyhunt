import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold:   "#C8A96E",
          dark:   "#0D0F0A",
          panel:  "#131510",
          border: "#2A2D1E",
          muted:  "#5A6040",
          cream:  "#E8E2D4",
        },
        zone: {
          vital: "#50C878",
          aim:   "#4A9EFF",
          warn:  "#FF8844",
          miss:  "#FF4444",
        }
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],
        body:    ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;