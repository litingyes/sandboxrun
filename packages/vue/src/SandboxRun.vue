<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import autoAnimate from '@formkit/auto-animate';
import { useElementBounding, useWindowSize } from '@vueuse/core';
import type { CSSProperties } from 'vue';
import { saveHtmlFile } from 'webfun';
import SandboxPreview from './components/SandboxPreview.vue';
import SandboxCodeEditor from './components/SandboxCodeEditor.vue';
import type { LANGS } from './constant';
import ArrowDown from './icons/ArrowDown.vue';
import IconDownload from './icons/Download.vue';

const sandboxRunProps = {
  html: {
    type: String,
    default: '<h1>Sandbox Run</h1>',
  },
  js: {
    type: String,
    default: '',
  },
  css: {
    type: String,
    default: '',
  },
};

export default defineComponent({
  name: 'SandboxRun',
  components: {
    SandboxPreview,
    SandboxCodeEditor,
    ArrowDown,
    IconDownload,
  },
  props: sandboxRunProps,
  setup(props) {
    const sandboxRunRef = ref<HTMLDivElement>();
    onMounted(() => {
      autoAnimate(sandboxRunRef.value!);
    });

    const codes = reactive<Record<Lowercase<LANGS>, string>>({
      html: decodeURIComponent(props.html),
      js: decodeURIComponent(props.js),
      css: decodeURIComponent(props.css),
    });
    const codeEditTypes: LANGS[] = ['HTML', 'JS', 'CSS'];
    const activeType = ref<LANGS>(codeEditTypes[0]);

    const editorRef = ref();
    const onToggleActiveType = (lang: LANGS) => {
      activeType.value = lang;
      editorRef.value?.toggleLang(
        lang,
        codes[lang.toLocaleLowerCase() as Lowercase<LANGS>]
      );
    };

    const showCode = ref(false);

    const showArrow = ref(false);

    const { height } = useWindowSize();
    const { top, bottom } = useElementBounding(sandboxRunRef);
    const arrowStyle = computed<CSSProperties>(() => {
      if (bottom.value <= height.value || top.value >= height.value) {
        if (showCode.value) {
          return {
            transform: `translateX(-50%) rotateX(180deg)`,
          };
        }

        return {
          transform: `translateX(-50%)`,
        };
      }

      if (showCode.value) {
        return {
          transform: `translateX(-50%) translateY(${
            height.value - bottom.value - 12
          }px) rotateX(180deg)`,
        };
      }

      return {
        transform: `translateX(-50%)  translateY(${
          height.value - bottom.value - 12
        }px)`,
      };
    });

    const previewRef = ref();
    const downloadCode = () => {
      saveHtmlFile('sandboxrun', previewRef.value.getCode());
    };

    return {
      sandboxRunRef,
      codes,
      codeEditTypes,
      activeType,
      editorRef,
      onToggleActiveType,
      showCode,
      showArrow,
      arrowStyle,
      previewRef,
      downloadCode,
    };
  },
});
</script>

<template>
  <div
    ref="sandboxRunRef"
    class="sandbox-run"
    @mouseenter="showArrow = true"
    @mouseleave="showArrow = false"
  >
    <div class="sandbox-run__preview">
      <SandboxPreview ref="previewRef" :codes="codes" />
    </div>
    <div v-if="showCode">
      <div class="sandbox-run__actions">
        <ul class="sandbox-run__tabs">
          <li
            v-for="item in codeEditTypes"
            :key="item"
            :class="{ 'is-active': activeType === item }"
            @click="onToggleActiveType(item)"
          >
            {{ item }}
          </li>
        </ul>
        <div class="sandbox-run__icons">
          <div
            class="sandbox-run__icon"
            title="download code"
            @click="downloadCode"
          >
            <IconDownload />
          </div>
        </div>
      </div>

      <SandboxCodeEditor
        ref="editorRef"
        :lang="activeType"
        @loaded="onToggleActiveType(activeType)"
        @update:html="(html) => (codes.html = html)"
        @update:js="(js) => (codes.js = js)"
        @update:css="(css) => (codes.css = css)"
      />
    </div>
    <Transition name="fade">
      <ArrowDown
        v-show="showArrow"
        class="sandbox-run__arrow"
        :class="{ reverse: showCode }"
        :style="arrowStyle"
        @click="showCode = !showCode"
      />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.sandbox-run {
  position: relative;
  background: #ffffff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px;
  color: #0f172a;

  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__tabs {
    list-style: none;
    margin: 0;
    padding: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;

    li {
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      // avoid override by vitepress style
      margin: 0;

      &:hover {
        background: #e2e8f0;
      }

      &.is-active {
        background: #3b82f6;
        color: #ffffff;
      }
    }
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      background: #e2e8f0;
    }
  }

  &__arrow {
    background: white;
    position: absolute;
    border: 1px rgba(0, 0, 0, 0.25) solid;
    left: 50%;
    bottom: -12px;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s;
    color: #475569;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s;
  }
}
</style>
