<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { refDebounced, useDebounceFn } from '@vueuse/core';
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
  setup(props, { expose }) {
    const loading = ref(false);
    const debounceLoading = refDebounced(loading);

    const sandboxPreviewRef = ref<HTMLDivElement>();
    let sandbox: HTMLIFrameElement;
    const updateSandbox = useDebounceFn(() => {
      loading.value = true;

      sandbox?.remove();

      sandbox = document?.createElement('iframe');
      sandbox.classList.add('sandbox-preview__iframe');
      sandbox.style.display = 'none';
      sandbox.style.width = '100%';
      sandbox.style.height = '100%';
      sandbox.style.minHeight = '200px';
      sandbox.style.border = 'none';
      sandbox.srcdoc = sandboxDoc
        .replace(/\/\* PLACEHOLDER_CSS \*\//, props.codes.css)
        .replace(/\/\/ PLACEHOLDER_JS/, props.codes.js)
        .replace(/<!-- PLACEHOLDER_HTML-->/, props.codes.html);
      sandboxPreviewRef.value?.appendChild(sandbox);
    });

    onMounted(() => {
      updateSandbox();

      window.addEventListener('message', ({ source, data }) => {
        if (!sandbox || source !== sandbox.contentWindow) return;

        switch (data.type) {
          case 'loaded': {
            sandbox.style.height = `${sandbox.contentDocument?.body.offsetHeight}px`;
            sandbox.style.display = 'block';
            loading.value = false;
            break;
          }
          default: {
            console.warn(`[sandboxrun] Unrecognized message: ${data.data}`);
          }
        }
      });
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

    function getCode() {
      return sandbox.srcdoc;
    }
    expose({
      getCode,
    });

    return {
      debounceLoading,
      sandboxPreviewRef,
    };
  },
});
</script>

<template>
  <div ref="sandboxPreviewRef" class="sandbox-preview">
    <div v-if="debounceLoading" class="sandbox-preview__skeleton">
      <div v-for="i in 5" :key="i" />
    </div>
  </div>
</template>

<style lang="scss">
.sandbox-preview {
  min-height: 200px;

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 16px;

    div {
      height: 24px;
      background: #e2e8f0;
      border-radius: 8px;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

      &:nth-child(2) {
        width: 80%;
      }

      &:nth-child(3) {
        width: 60%;
      }

      &:nth-child(4) {
        width: 40%;
      }

      &:nth-child(5) {
        width: 20%;
      }
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}
</style>
