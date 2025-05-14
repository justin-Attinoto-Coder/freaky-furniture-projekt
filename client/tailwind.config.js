/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './src/app/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      keyframes: {
        bounceIn: {
          '0%': { transform: 'translateY(-100%)' },
          '20%': { transform: 'translateY(-67%)' },
          '40%': { transform: 'translateY(-33%)' },
          '60%': { transform: 'translateY(0%)' },
          '80%': { transform: 'translateY(20%)' },
          '100%': { transform: 'translateY(0%)' }
        },
        stretch: {
          '0%': { height: '0' },
          '80%': { height: '120vh' },
          '90%': { height: '110vh' },
          '100%': { height: '100vh' }
        }
      },
      animation: {
        bounceIn: 'bounceIn 0.5s ease-in-out',
        stretch: 'stretch 0.5s ease-in-out forwards'
      }
    }
  },
  plugins: []
};
