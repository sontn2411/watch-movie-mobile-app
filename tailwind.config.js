/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        's-xs': 'var(--scale-font-xs)',
        's-sm': 'var(--scale-font-sm)',
        's-md': 'var(--scale-font-md)',
        's-lg': 'var(--scale-font-lg)',
        's-xl': 'var(--scale-font-xl)',
        's-xxl': 'var(--scale-font-xxl)',
        's-xxxl': 'var(--scale-font-xxxl)',
        's-display': 'var(--scale-font-display)',
      },
      spacing: {
        's-xs': 'var(--scale-space-xs)',
        's-sm': 'var(--scale-space-sm)',
        's-md': 'var(--scale-space-md)',
        's-lg': 'var(--scale-space-lg)',
        's-xl': 'var(--scale-space-xl)',
        's-xxl': 'var(--scale-space-xxl)',
        's-xxxl': 'var(--scale-space-xxxl)',
      }
    },
  },
  plugins: [],
}
