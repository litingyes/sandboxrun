import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Sandboxrun',
  description: 'Lightweight preview and real-time editing front-end trio',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
    },
  },
});
