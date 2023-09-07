import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        primaryAlt: "rgb(var(--color-primary-alt) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        foregroundLighter:
          "rgb(var(--color-foregroundLighter) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        body: "rgb(var(--color-body) / <alpha-value>)",
        light: "rgb(var(--color-light) / <alpha-value>)",
      },
    },
  },
  plugins: [],
} satisfies Config;
