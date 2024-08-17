/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#EF6144",
                "primary-light": "#f28169",
                secondary: "#F6F6F6",
            },
        },
    },
    plugins: [],
};
