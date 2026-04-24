/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                'blue': '#2563EB',
                'blue-100': '#dbeafe',
                'blue-600': '#2563eb',
                'cyan': '#3FB1FA',
                'lightblue': '#EFF6FF',
                'darkblue': '#0073AD',
                // 'gray': '#18191F',
                'mediumgray': '#676262',
                'lightgray': '#E5EDF2',
                'dimgray': '#4A4444',
                'dim': '#F7F8FA',
                'red': '#FF0000',
                'lightred': '#FEF2F2',
                'purple': '#F1E4FF',
                'purple-500': '#a855f7',
                'purple-700': '#7e22ce',
                'black': '#0B0D17'

            },
            fontFamily: {
                'inter': ['Inter'],
            },
        },
    },
    plugins: [],
}
