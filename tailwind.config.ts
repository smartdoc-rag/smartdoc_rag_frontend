import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
  extend: {
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    boxShadow: {
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
    },
    borderColor: {
      DEFAULT: "oklch(var(--border))",
    },
  },
},
  plugins: [],
};

export default config;