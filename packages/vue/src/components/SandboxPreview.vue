<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, defineProps } from 'vue3';
import { useDebounceFn } from '@vueuse/core';
import sandboxDoc from '../sandbox.html?raw';
import type { LANGS } from '../constant';

interface Props {
  codes: Record<Lowercase<LANGS>, string>;
}

const props = withDefaults(defineProps<Props>(), {
  codes: () => ({
    html: '<h1>Sandbox Run</h1>',
    js: '',
    css: '',
  }),
});

const sandboxPreviewRef = ref<HTMLDivElement>();
let sandbox: HTMLIFrameElement;
const updateSandbox = useDebounceFn(() => {
  sandbox?.remove();

  sandbox = document?.createElement('iframe');
  sandbox.classList.add('sandbox-preview__iframe');
  sandbox.style.width = '100%';
  sandbox.style.height = '100%';
  sandbox.style.border = 'none';
  sandbox.srcdoc = sandboxDoc
    .replace(/\/\* PLACEHOLDER_CSS \*\//, props.codes.css)
    .replace(/<!-- PLACEHOLDER_JS -->/, props.codes.js)
    .replace(/<!-- PLACEHOLDER_HTML-->/, props.codes.html);
  sandboxPreviewRef.value?.appendChild(sandbox);
});

onMounted(() => {
  updateSandbox();
});
watch(
  () => props.codes,
  () => {
    updateSandbox();
  },
  {
    deep: true,
  }
);
onBeforeUnmount(() => {
  sandbox?.remove();
});
</script>

<template>
  <div ref="sandboxPreviewRef" class="sandbox-preview"></div>
</template>
