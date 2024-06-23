/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-dark": "rgb(5,0,33)",
        "custom-darker": "rgba(10,0,72,1)",
      },
      backgroundImage: {
        "dark-gradient":
          "linear-gradient(90deg, rgba(5,0,33,1) 0%, rgba(10,0,72,1) 54%, rgba(5,0,33,1) 100%)",
      },
      fontFamily: {
        mthin: ["Montserrat-Thin", "sans-serif"],
        mextralight: ["Montserrat-ExtraLight", "sans-serif"],
        mlight: ["Montserrat-Light", "sans-serif"],
        mregular: ["Montserrat-Regular", "sans-serif"],
        mmedium: ["Montserrat-Medium", "sans-serif"],
        msemibold: ["Montserrat-SemiBold", "sans-serif"],
        mbold: ["Montserrat-Bold", "sans-serif"],
        mextrabold: ["Montserrat-ExtraBold", "sans-serif"],
        mblack: ["Montserrat-Black", "sans-serif"],
        mitalic: ["Montserrat-Italic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
