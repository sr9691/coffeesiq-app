import type { Config } from "tailwindcss";
import { themeConfig } from "./config/theme.config";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [themeConfig.typography.primaryFont],
        heading: [themeConfig.typography.headingFont],
        mono: [themeConfig.typography.monoFont],
      },
      borderRadius: {
        none: themeConfig.borderRadius.none,
        sm: themeConfig.borderRadius.sm,
        md: themeConfig.borderRadius.md,
        lg: themeConfig.borderRadius.lg,
        xl: themeConfig.borderRadius.xl,
        full: themeConfig.borderRadius.full,
        // Shadcn compatibility
        "lg-shadcn": "var(--radius)",
        "md-shadcn": "calc(var(--radius) - 2px)",
        "sm-shadcn": "calc(var(--radius) - 4px)",
      },
      colors: {
        // Shadcn theme colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Coffee theme colors - from theme.config.ts
        "coffee-brown": themeConfig.colors.coffeeBrown,
        "coffee-red": themeConfig.colors.coffeeRed,
        "coffee-green": themeConfig.colors.coffeeGreen,
        "coffee-cream": themeConfig.colors.coffeeCream,
        "coffee-light": themeConfig.colors.coffeeLight,
        "coffee-espresso": themeConfig.colors.espresso,
        "coffee-milky": themeConfig.colors.milky,
      },
      boxShadow: {
        sm: themeConfig.shadows.sm,
        md: themeConfig.shadows.md,
        lg: themeConfig.shadows.lg,
        xl: themeConfig.shadows.xl,
      },
      spacing: themeConfig.spacing,
      zIndex: {
        "0": themeConfig.zIndex[0].toString(),
        "10": themeConfig.zIndex[10].toString(),
        "20": themeConfig.zIndex[20].toString(),
        "30": themeConfig.zIndex[30].toString(),
        "40": themeConfig.zIndex[40].toString(),
        "50": themeConfig.zIndex[50].toString(),
        "auto": themeConfig.zIndex.auto,
      },
      keyframes: {
        // Accordion animations
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Scanner animation
        "scan": {
          "0%": {
            top: "0",
          },
          "50%": {
            top: "100%",
          },
          "100%": {
            top: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scan": "scan 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
