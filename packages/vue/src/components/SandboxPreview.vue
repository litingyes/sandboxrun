<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import sandboxDoc from '../sandbox.html?raw';

interface Props {
  html?: string;
  js?: string;
  css?: string;
}

const props = withDefaults(defineProps<Props>(), {
  html: '<h1>Sandbox Run</h1>',
  js: '',
  css: '',
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
    .replace(/\/\* PLACEHOLDER_CSS \*\//, props.css)
    .replace(/<!-- PLACEHOLDER_JS -->/, props.js)
    .replace(/<!-- PLACEHOLDER_HTML-->/, props.html);
  sandboxPreviewRef.value?.appendChild(sandbox);
});

onMounted(() => {
  updateSandbox();
});
watch([() => props.html, () => props.js, () => props.css], () => {
  updateSandbox();
});
onBeforeUnmount(() => {
  sandbox?.remove();
});
</script>

<template>
  <div ref="sandboxPreviewRef" class="sandbox-preview"></div>
</template>
