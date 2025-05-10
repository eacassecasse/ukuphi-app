module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounceIn: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-30px)' },
          '60%': { transform: 'translateY(-15px)' },
        },
        growShrink: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.8' },
        },
      },
      animation: {
        bounceIn: 'bounceIn 1s ease-in-out infinite',
        growShrink: 'growShrink 1.5s ease-in-out infinite',
        bounceAndGrow: 'bounceIn 1s ease-in-out infinite, growShrink 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
