import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tailwindPostcssPlugin = require.resolve("@tailwindcss/postcss");

const config = {
  plugins: {
    [tailwindPostcssPlugin]: {},
  },
};

export default config;
