/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  safelist: [
    // Dynamic olarak kullanılan tüm sınıfları safelist'e ekle
    // Background colors
    "bg-white",
    "bg-slate-50",
    "bg-slate-800",
    "bg-slate-900",
    "bg-indigo-500",
    "bg-indigo-400",
    "bg-violet-500",
    "bg-violet-400",
    "bg-red-500",
    "bg-red-400",
    "bg-emerald-500",
    "bg-emerald-400",
    "bg-amber-500",
    "bg-amber-400",

    // Text colors
    "text-slate-800",
    "text-slate-500",
    "text-slate-100",
    "text-slate-400",
    "text-indigo-500",
    "text-indigo-400",
    "text-violet-500",
    "text-violet-400",
    "text-red-500",
    "text-red-400",
    "text-emerald-500",
    "text-emerald-400",
    "text-amber-500",
    "text-amber-400",

    // Border colors
    "border-slate-200",
    "border-slate-700",
    "border-indigo-500",
    "border-indigo-400",
    "border-violet-500",
    "border-violet-400",
    "border-red-500",
    "border-red-400",
    "border-emerald-500",
    "border-emerald-400",
    "border-amber-500",
    "border-amber-400",

    // Pattern matching - tema renklerinizi otomatik dahil eder
    {
      pattern:
        /bg-(slate|indigo|violet|red|emerald|amber)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern:
        /text-(slate|indigo|violet|red|emerald|amber)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern:
        /border-(slate|indigo|violet|red|emerald|amber)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern:
        /ring-(slate|indigo|violet|red|emerald|amber)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {
      scale: {
        98: "0.98",
        102: "1.02",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "soft-md": "0 4px 6px rgba(0,0,0,0.1)",
        "soft-lg": "0 10px 15px rgba(0,0,0,0.1)",
        "shadow-small":
          "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px 0 rgba(0,0,0,0.05)",
        "shadow-medium": "0 4px 6px rgba(0,0,0,0.1)",
        "shadow-large": "0 10px 15px rgba(0,0,0,0.1)",
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      animation: {
        modalShow: "modalShowAnimation 0.2s ease-out forwards",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        modalShowAnimation: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
