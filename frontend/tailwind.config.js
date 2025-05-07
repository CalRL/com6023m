/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                lightBg: '#fefcfb',
                darkBg: '#171717',
            },
        },
    },
    plugins: [],
}