/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caveat: ['"Caveat"' , 'cursive'],
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        beige: {
          50: '#F5F5DC', // Lightest Beige (Background)
          100: '#FAF0E6', // Linen
          200: '#F0E68C', // Khaki
        },
        brown: {
          500: '#A0522D', // Sienna (Footer text)
          600: '#8B4513', // SaddleBrown (Body text)
          700: '#5C4033', // Dark Brown (Headings, primary text)
          800: '#4A3B31', // Darker Brown (Stronger headings)
        },
        teal: {
          500: '#14B8A6', // Teal (Accent, buttons)
          600: '#0D9488', // Darker Teal (Hover)
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
