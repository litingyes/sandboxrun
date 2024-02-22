import { defineConfig } from 'vitepress';
import { vitePlugin } from '../../packages/vue/src/plugins/vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Sandboxrun',
  description: 'Lightweight preview and real-time editing front-end trio',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/liting-yes/sandboxrun' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Liting Yes',
    },
    search: {
      provider: 'local',
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [{ text: 'Guide', link: '/guide/vitepress' }],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Vitepress', link: '/guide/vitepress' },
              { text: 'Vue', link: '/guide/vue' },
            ],
          },
        ],
      },
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [{ text: '指南', link: '/zh-CN/guide/vitepress' }],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: 'Vitepress', link: '/zh-CN/guide/vitepress' },
              { text: 'Vue', link: '/zh-CN/guide/vue' },
            ],
          },
        ],
      },
    },
  },
  vite: {
    plugins: [vitePlugin()],
  },
});
