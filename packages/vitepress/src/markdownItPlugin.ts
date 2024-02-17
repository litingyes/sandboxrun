import container from 'markdown-it-container';

const HTML_BLOCK = /```html(.+)?```/im;
const JS_BLOCK = /```js(.+)?```/im;
const CSS_BLOCK = /```css(.+)?```/im;

export function markdownItSandboxPlugin() {
  return [
    container,
    'sandbox',
    {
      validate(code: string) {
        return code.trim().match(/^sandbox\s+(.*)$/) && HTML_BLOCK.test(code);
      },
      render(
        tokens: { [x: string]: { info: string; nesting: number } },
        idx: string | number
      ) {
        const code = tokens[idx].info.trim().match(/^sandbox\s+(.*)$/)![1];

        const html = (HTML_BLOCK.exec(code) && HTML_BLOCK.exec(code)![1]) ?? '';
        const js = (JS_BLOCK.exec(code) && JS_BLOCK.exec(code)![1]) ?? '';
        const css = (CSS_BLOCK.exec(code) && CSS_BLOCK.exec(code)![1]) ?? '';

        if (tokens[idx].nesting === 1)
          return `<SandboxRun html="${encodeURIComponent(
            html
          )}" js="${encodeURIComponent(js)}" css="${encodeURIComponent(css)}">`;
        else return '</SandboxRun>\n';
      },
    },
  ];
}
