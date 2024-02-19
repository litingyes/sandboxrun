# Vitepress

## Installation

::: code-group

```bash [pnpm]
pnpm add @sandboxrun/vitepress
```

```bash [npm]
npm i @sandboxrun/vitepress
```

:::

## Setup

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress';
import { markdownItSandboxPlugin } from '@sandboxrun/vitepress';

export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(markdownItSandboxPlugin);
    },
  },
});
```
