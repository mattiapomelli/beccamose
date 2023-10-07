/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        scaffoldEth: {
          primary: "#ef9995",
          "primary-content": "#282425",
          secondary: "#a4cbb4",
          "secondary-content": "#282425",
          accent: "#DC8850",
          "accent-content": "#282425",
          neutral: "#2E282A",
          "neutral-content": "#EDE6D4",
          "base-100": "#e4d8b4",
          "base-200": "#DBCA9A",
          "base-300": "#D4BF87",
          "base-content": "#282425",
          info: "#2563eb",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
          "--rounded-box": "0.4rem",
          "--rounded-btn": "0.4rem",
          "--rounded-badge": "0.4rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
        },
      },
      {
        scaffoldEthDark: {
          primary: "#e779c1",
          secondary: "#58c7f3",
          accent: "#f3cc30",
          neutral: "#221551",
          "neutral-content": "#f9f7fd",
          "base-100": "#1a103d",
          "base-content": "#f9f7fd",
          info: "#53c0f3",
          "info-content": "#201047",
          success: "#71ead2",
          "success-content": "#201047",
          warning: "#f3cc30",
          "warning-content": "#201047",
          error: "#e24056",
          "error-content": "#f9f7fd",
          "--rounded-box": "0.4rem",
          "--rounded-btn": "0.4rem",
          "--rounded-badge": "0.4rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
        },
      },
    ],
  },
  theme: {
    // Extend Tailwind classes (e.g. font-bai-jamjuree, animate-grow)
    extend: {
      fontFamily: {
        "bai-jamjuree": ["Bai Jamjuree", "sans-serif"],
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        grow: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
        zoom: {
          "0%, 100%": { transform: "scale(1, 1)" },
          "50%": { transform: "scale(1.1, 1.1)" },
        },
      },
      animation: {
        grow: "grow 5s linear infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        zoom: "zoom 1s ease infinite",
      },
    },
  },
};
