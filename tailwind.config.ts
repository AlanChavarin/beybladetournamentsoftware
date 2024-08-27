import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik Mono One'],
        sans: ['Montserrat', "var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        'red': '#BC1F1F',
        'darkGray': '#242424',
        'lightGray1': '#787878',
        'lightGray2': '#C2C2C2',
        'lightGray3': '#E3E3E3',
        'green': '#3A843A',
        'darkGreen': '#123E12',
      }
    },
  },
  plugins: [],
} satisfies Config;
