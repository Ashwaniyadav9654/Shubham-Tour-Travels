import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ──────────────────────────────────────────────────────────
           REDESIGN 2026 — deep charcoal / off-white / single brass accent.
           Token NAMES are deliberately unchanged so every page that was
           not individually rewritten still inherits the new aesthetic.
           ────────────────────────────────────────────────────────── */

        /* Brass — one restrained accent. Desaturated from the old gold;
           used for hairlines, eyebrows and small marks, never as fill. */
        gold: {
          50:  '#faf8f3',
          100: '#f0ebdf',
          200: '#ded2b8',
          300: '#cdb994',
          400: '#c0a172',
          500: '#a98a5c',
          600: '#8c7049',
          700: '#6e573a',
          800: '#52412c',
          900: '#382d1f',
        },

        /* Charcoal ramp — 950 is the page black, 50 the off-white. */
        obsidian: {
          50:  '#f5f3ee',
          100: '#e8e5dd',
          200: '#d0ccc3',
          300: '#aeaaa1',
          400: '#8b8780',
          500: '#6a6762',
          600: '#4d4b47',
          700: '#343330',
          800: '#232322',
          900: '#161617',
          950: '#0b0b0c',
        },

        cream: '#f5f3ee',
        parchment: '#ebe8e1',

        /* Jewel-tone accents — see src/lib/palette.ts. Used for per-card
           identity, glows and animated gradients. */
        hue: {
          saffron: '#f5a524',
          peacock: '#12b5ac',
          indigo: '#7c6bf5',
          rose: '#f2547d',
          emerald: '#34d399',
          ember: '#ff7043',
        },

        /* Named surfaces for the redesigned sections */
        ink: '#0b0b0c',
        carbon: '#121214',
        graphite: '#18181b',
        hairline: '#26262a',
        bone: '#f5f3ee',
        brass: '#c0a172',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        /* Fraunces — variable, high-contrast editorial serif. Replaces
           Playfair Display everywhere `font-display` is already used. */
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Sans', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.055em',
        tighter: '-0.035em',
      },
      backgroundImage: {
        /* Gradients removed from the design language — these remain as flat
           colours so any page still referencing them stays coherent. */
        'gold-gradient': 'none',
        'dark-gradient': 'none',
        'hero-overlay': 'none',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'expo': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [animate],
}

export default config
