---
received: 2022-10-15T09:49:11.468722+00:00
tags:
  - astro
  - js
---

#astro
//astro.config.mjs export default defineConfig({ markdown: { rehypePlugins: [ setFallbackLayout ] }, }); function setFallbackLayout() { // sets a default layout for all md/mdx files return function (\_tree, file) { const layout = file.data.astro.frontmatter.layout ?? "../layouts/Layout.astro"; file.data.astro.frontmatter.layout = layout; }; }
