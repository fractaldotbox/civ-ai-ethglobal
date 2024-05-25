/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,tsx}"],
    theme: {
        extend: {},
    },
    safelist: [

        'bg-white',

        // #fdba74
        'bg-orange-100',
        'bg-blue-500',
        'bg-cyan-500',

        // #1e40af
        'bg-blue-950',
        'bg-violet-500',
        'bg-green-500',
        'bg-red-500',

        'text-cyan-500',
        'text-blue-500',
        'text-white',
        'text-violet-500',
        'text-green-500',
        'text-red-500',
        'text-3xl',
        'lg:text-4xl',
    ],
    // safelist: [/^bg-/, /^text-/, /^border-/].map(
    //     pattern => { pattern }
    // ),
    plugins: [
        require('daisyui'),
    ],
}