import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import SandBoxRun from '../../../packages/vue/src/SandboxRun.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SandBoxRun', SandBoxRun);
  },
} satisfies Theme;
