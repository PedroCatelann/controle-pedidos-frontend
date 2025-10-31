import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Seus arquivos de código do Next.js (páginas, componentes, layouts)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

    // **IMPORTANTE:** Adicione o caminho para o Flowbite React
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      // Adicione aqui qualquer extensão de tema do seu projeto
    },
  },
  plugins: [
    // **IMPORTANTE:** Adicione o plugin do Flowbite
    require("flowbite/plugin"),
  ],
};

export default config;
