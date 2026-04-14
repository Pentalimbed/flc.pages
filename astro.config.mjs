// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from "@astrojs/mdx";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  i18n: {
    locales: ["en", "zh-cn"],
    defaultLocale: "en",
  },

  integrations: [mdx()],
  adapter: cloudflare(),

  fonts: [{
    provider: fontProviders.local(),
    name: "SUSE Mono",
    cssVariable: "--font-suse-mono",
    fallbacks: [],
    optimizedFallbacks: false,
    subsets: ["latin-ext"],
    options: {
      variants: [
        {
          weight: "100 800",
          style: "normal",
          src: ["./src/assets/fonts/SUSEMono[wght].woff2"],
        },
        {
          weight: "100 800",
          style: "italic",
          src: ["./src/assets/fonts/SUSEMono-Italic[wght].woff2"],
        },
      ],
    },
  }, {
    provider: fontProviders.local(),
    name: "Newsreader",
    cssVariable: "--font-newsreader",
    fallbacks: [],
    optimizedFallbacks: false,
    subsets: ["latin-ext"],
    options: {
      variants: [
        {
          weight: "200 800",
          style: "normal",
          src: ["./src/assets/fonts/Newsreader[opsz,wght].woff2"],
        },
        {
          weight: "200 800",
          style: "italic",
          src: ["./src/assets/fonts/Newsreader-Italic[opsz,wght].woff2"],
        },
      ],
    },
  }, {
    provider: fontProviders.local(),
    name: "Playfair",
    cssVariable: "--font-playfair",
    fallbacks: [],
    optimizedFallbacks: false,
    subsets: ["latin-ext"],
    options: {
      variants: [
        {
          weight: "300 900",
          stretch: "87.5% 112.5%",
          style: "normal",
          src: ["./src/assets/fonts/PlayfairRomanVF.woff2"],
        },
        {
          weight: "300 900",
          stretch: "87.5% 112.5%",
          style: "italic",
          src: ["./src/assets/fonts/PlayfairItalicVF.woff2"],
        },
      ],
    },
  }]
});