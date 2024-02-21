# Vitepress

## 安装

::: code-group

```bash [pnpm]
pnpm add @sandboxrun/vue
```

```bash [npm]
npm i @sandboxrun/vue
```

:::

## 设置

### 添加 Vite 插件

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress';
import { vitePlugin } from '@sandboxrun/vue'; // [!code focus]

export default defineConfig({
  vite: {
    plugins: [vitePlugin()], // [!code focus]
  },
});
```

### 注册组件

```ts
// .vitepress/theme/index.ts
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { SandBoxRun } from '@sandboxrun/vue'; // [!code focus]
import '@sandboxrun/vue/style'; // [!code focus]

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SandBoxRun', SandBoxRun); // [!code focus]
  },
} satisfies Theme;
```

## 演示

::: tip Code in MarkDown
&colon;&colon;&colon; sandboxrun

&#96;&#96;&#96;html

&lt;div&gt;Sandboxrun&lt;/div&gt;

&#96;&#96;&#96;

&colon;&colon;&colon;
:::

::: sandboxrun

```html
<div>Sandboxrun</div>
```

:::
