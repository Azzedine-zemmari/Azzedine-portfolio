/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", 
    ],
    theme: {
        extend: {
            fontFamily: {
                syne: ['Syne', 'sans-serif'], 
            },
            colors: {
                amberCustom: '#FFC107', 
            },
            letterSpacing: {
                widestCustom: '0.2em', 
                widerCustom: '0.15em',
            },
        },
    },
    plugins: [],
};
