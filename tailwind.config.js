/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            backdropBlur: {
                sm: '4px',
                DEFAULT: '8px',
                md: '12px',
            },
        },
        plugins: [],
    }
}
