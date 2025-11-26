/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Set Oswald as the default sans font
                sans: ['Oswald', 'sans-serif'],
            },
            colors: {
                background: '#ffffff',
                text: '#1a3d64',
                primary: {
                    DEFAULT: '#1a3d64',
                    dark: '#0c2b4e',
                    light: '#1d546c',
                },
                accent: {
                    DEFAULT: '#1d546c',
                    light: '#2a7089',
                },
                neutral: {
                    light: '#f4f4f4',
                    DEFAULT: '#e5e5e5',
                }
            },
        },
    },
    plugins: [],
}