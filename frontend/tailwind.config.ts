import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        foundry: {
          abyss: 'var(--foundry-abyss)',
          panel: 'var(--foundry-panel)',
          surface: 'var(--foundry-surface)',
          border: 'var(--foundry-border)',
          'border-active': 'var(--foundry-border-active)',
          blue: 'var(--foundry-blue)',
          'blue-hover': 'var(--foundry-blue-hover)',
          titanium: 'var(--foundry-titanium)',
          aluminum: 'var(--foundry-aluminum)',
          muted: 'var(--foundry-muted)',
        },
        surface: "#f8fafc",
        "surface-card": "#ffffff",
        "surface-dim": "#f1f5f9",
        "surface-container": "#f8fafc",
        "surface-container-high": "#e2e8f0",
        "border-subtle": "#e2e8f0",
        "border-muted": "#cbd5e1",
        primary: {
          DEFAULT: "#d97706",
          dark: "#b45309",
          light: "#fef3c7",
          fixed: "#ffdbca",
        },
        "on-surface": "#0f172a",
        "on-surface-variant": "#475569",
        secondary: "#64748b",
        tertiary: {
          DEFAULT: "#059669",
          light: "#d1fae5",
          dark: "#006444",
        },
        warning: {
          DEFAULT: "#d97706",
          light: "#fef3c7",
        },
        error: {
          DEFAULT: "#dc2626",
          light: "#fee2e2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        "body-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "title-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "headline-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "code-sm": ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        "code-md": ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        "label-caps": ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        xs: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)",
        dropdown: "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)",
        hardware: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

export default config;
