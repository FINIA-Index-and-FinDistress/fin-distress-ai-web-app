/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                'indigo-main': '#4F46E5',
                'purple-main': '#8B5CF6',
                'green-success': '#10B981',
                'yellow-warning': '#F59E0B',
                'red-error': '#EF4444',
                'blue-info': '#3B82F6',
                'light-grey-blue': '#F8F9FB',
                'soft-light-blue': '#E0F2FE',
                'faint-light-indigo': '#EEF2FF',
                'dark-grey-text': '#374151',
                'medium-grey-text': '#6B7280',
            },
            keyframes: {
                ping: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.2)', opacity: '0.5' },
                },
                pulseSlow: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.6' },
                },
                moveBg1: {
                    '0%': { transform: 'translate(0, 0)', opacity: '0.4' },
                    '50%': { transform: 'translate(10vw, 5vw)', opacity: '0.6' },
                    '100%': { transform: 'translate(0, 0)', opacity: '0.4' },
                },
                moveBg2: {
                    '0%': { transform: 'translate(0, 0)', opacity: '0.4' },
                    '50%': { transform: 'translate(-8vw, -3vw)', opacity: '0.6' },
                    '100%': { transform: 'translate(0, 0)', opacity: '0.4' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideOutRight: {
                    '0%': { transform: 'translateX(0)', opacity: '1' },
                    '100%': { transform: 'translateX(100%)', opacity: '0' },
                }
            },
            animation: {
                ping: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                pulseSlow: 'pulseSlow 6s ease-in-out infinite',
                moveBg1: 'moveBg1 15s ease-in-out infinite alternate',
                moveBg2: 'moveBg2 18s ease-in-out infinite alternate',
                slideInRight: 'slideInRight 0.3s ease-out forwards',
                slideOutRight: 'slideOutRight 0.3s ease-in forwards',
            }
        },
    },
    plugins: [],
}