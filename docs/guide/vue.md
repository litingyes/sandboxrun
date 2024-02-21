# Vue

## Installation

::: code-group

```bash [pnpm]
pnpm add @sandboxrun/vue
```

```bash [npm]
npm i @sandboxrun/vue
```

:::

## Register Component

```ts
// src/main.ts
import { createApp } from 'vue';
import { SandBoxRun } from '@sandboxrun/vue'; // [!code focus]
import App from './App.vue';
import '@sandboxrun/vue/style'; // [!code focus]

const app = createApp(App);
app.component('SandBoxRun', SandBoxRun); // [!code focus]
app.mount('#app');
```

### SandBoxRun Props

```ts
interface SandBoxRunProps {
  html: string; // 初始 html 内容
  js: string; // 初始 js 内容
  css: string; // 初始 css 内容
}
```

## Demo

::: tip Code

```vue
<SandBoxRun html="<div>Sandboxrun</div>" />
```

:::

<SandBoxRun html="<div>Sandboxrun</div>" />
