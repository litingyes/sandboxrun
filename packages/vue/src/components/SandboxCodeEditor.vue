<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import type { PropType } from 'vue';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import type { LANGS } from '../constant';

const sandboxCodeEditorProps = {
  lang: {
    type: String as PropType<LANGS>,
  },
};
const sandboxCodeEditorEmits = {
  loaded: () => {},
  'update:html': (_content: string) => {},
  'update:js': (_content: string) => {},
  'update:css': (_content: string) => {},
};

function getLangConfig(lang: LANGS) {
  if (lang === 'HTML') return html();
  else if (lang === 'JS') return javascript();
  else return css();
}

export default defineComponent({
  name: 'SandboxCodeEditor',
  props: sandboxCodeEditorProps,
  emits: sandboxCodeEditorEmits,
  setup(props, { emit, expose }) {
    const container = ref<HTMLDivElement>();
    let codemirror: EditorView;

    onMounted(() => {
      const state = EditorState.create({
        extensions: [basicSetup, oneDark],
      });

      codemirror = new EditorView({
        state,
        parent: container.value,
      });

      emit('loaded');
    });
    onBeforeUnmount(() => {
      codemirror?.destroy();
    });

    const toggleLang = (lang: LANGS, code: string) => {
      codemirror.setState(
        EditorState.create({
          doc: code,
          extensions: [
            basicSetup,
            oneDark,
            getLangConfig(lang),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const code = update.state.doc.toString();

                if (props.lang === 'HTML') emit('update:html', code.trim());
                else if (props.lang === 'JS') emit('update:js', code.trim());
                else if (props.lang === 'CSS') emit('update:css', code.trim());
              }
            }),
          ],
        })
      );
    };

    expose({
      toggleLang,
    });

    return {
      container,
    };
  },
});
</script>

<template>
  <div ref="container" class="sandbox-code-editor" />
</template>

<style lang="scss">
.sandbox-code-editor {
  border-radius: 8px;
  overflow: hidden;
  font-size: 16px;

  .cm-editor {
    min-height: 100px;

    &.cm-focused {
      outline: none !important;
    }
  }
}
</style>
