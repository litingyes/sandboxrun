<script lang="ts" setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  defineProps,
  defineEmits,
} from 'vue3';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import type { LANGS } from '../constant';

export interface Props {
  lang?: LANGS;
}
export interface Emits {
  (name: 'loaded'): void;
  (name: 'update:html', content: string): void;
  (name: 'update:js', content: string): void;
  (name: 'update:css', content: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'HTML',
});
const emit = defineEmits<Emits>();

const container = ref<HTMLDivElement>();
let codemirror: EditorView;

const getLangConfig = (lang: LANGS) => {
  if (lang === 'HTML') {
    return html();
  } else if (lang === 'JS') {
    return javascript();
  } else {
    return css();
  }
};

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

            if (props.lang === 'HTML') {
              emit('update:html', code.trim());
            } else if (props.lang === 'JS') {
              emit('update:js', code.trim());
            } else if (props.lang === 'CSS') {
              emit('update:css', code.trim());
            }
          }
        }),
      ],
    })
  );
};

defineExpose({
  toggleLang,
});
</script>

<template>
  <div ref="container" class="sandbox-code-editor"></div>
</template>

<style lang="scss">
.sandbox-code-editor {
  border-radius: 8px;
  overflow: hidden;

  .cm-editor {
    min-height: 100px;

    &.cm-focused {
      outline: none !important;
    }
  }
}
</style>
