import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
  extend: {
    colors: {
      sidebar: {
        DEFAULT: "var(--sidebar)",
        foreground: "var(--sidebar-foreground)",
        accent: "var(--sidebar-accent)",
        "accent-foreground": "var(--sidebar-accent-foreground)",
        border: "var(--sidebar-border)",
        ring: "var(--sidebar-ring)",
      },
    },
  },
},
  plugins: [],
};

export default config;