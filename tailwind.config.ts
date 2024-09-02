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
        'specialRed': '#BC1F1F',
        'darkGray': '#242424',
        'lightGray1': '#787878',
        'lightGray2': '#C2C2C2',
        'lightGray3': '#E3E3E3',
        'lightGray4': '#484848',
        'lightGray5': '#D1D1D1',
        'lightGray6': '#F5F5F5',
        'lightGray7': '#929292',
        'green': '#3A843A',
        'greenHover': '#377d37',
        'darkGreen': '#123E12',
        'darkGreenHover': '#0d2e0d',
      }
    },
  },
  plugins: [],
} satisfies Config;
