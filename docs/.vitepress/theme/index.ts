import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { SandBoxRun } from '@sandboxrun/vue';
import '@sandboxrun/vue/style';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SandBoxRun', SandBoxRun);
  },
} satisfies Theme;
