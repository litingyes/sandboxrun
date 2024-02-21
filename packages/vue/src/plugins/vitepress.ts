import type { Plugin } from 'vite';

const BLOCK_REG = /^::: sandboxrun([\s\S]+?):::$/gim;

export function vitePlugin(): Plugin {
  return {
    name: 'vite-plugin-vitepress-sandboxrun',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!id.endsWith('.md') || !BLOCK_REG.test(code)) return code;

      code = code.replaceAll(BLOCK_REG, (block, code: string) => {
        const html = code.match(/^```html\n([\s\S]+?)```$/im)
          ? code.match(/^```html\n([\s\S]+?)```$/im)![1]
          : '';
        if (!html) return block;

        const js = code.match(/^```js\n([\s\S]+?)```$/im)
          ? code.match(/^```js\n([\s\S]+?)```$/im)![1]
          : '';
        const css = code.match(/^```css\n([\s\S]+?)```$/im)
          ? code.match(/^```css\n([\s\S]+?)```$/im)![1]
          : '';

        return `<sand-box-run html="${encodeURIComponent(
          html
        )}" js="${encodeURIComponent(js)}" css="${encodeURIComponent(
          css
        )}" />\n`;
      });

      return code;
    },
  };
}
