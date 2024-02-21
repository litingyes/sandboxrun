<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import sandboxDoc from '../sandbox.html?raw';
import type { LANGS } from '../constant';

const sandboxPreviewProps = {
  codes: {
    type: Object as PropType<Record<Lowercase<LANGS>, string>>,
    default: () => ({
      html: '<h1>Sandbox Run</h1>',
      js: '',
      css: '',
    }),
  },
};

export default defineComponent({
  name: 'SandboxPreview',
  props: sandboxPreviewProps,
  setup(props) {
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
        .replace(/\/\/ PLACEHOLDER_JS/, props.codes.js)
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

    return {
      sandboxPreviewRef,
    };
  },
});
</script>

<template>
  <div ref="sandboxPreviewRef" class="sandbox-preview" />
</template>
