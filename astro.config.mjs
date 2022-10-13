import {
  defineConfig
} from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    rehypePlugins: [
      setFallbackLayout
    ]
  },
});

function setFallbackLayout() {
  // sets a default layout for all md/mdx files
  return function (_tree, file) {
    const layout =
      file.data.astro.frontmatter.layout ?? "./src/layouts/Layout.astro";
    file.data.astro.frontmatter.layout = layout;
  };
}