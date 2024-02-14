<script lang="ts" setup>
import { ref, reactive } from 'vue';
import SandboxPreview from './components/SandboxPreview.vue';
import SandboxCodeEditor from './components/SandboxCodeEditor.vue';
import type { LANGS } from './constant';

interface Props {
  html?: string;
  js?: string;
  css?: string;
}
const props = withDefaults(defineProps<Props>(), {
  html: '<h1>Sandbox Run</h1>',
});

const codes = reactive<Record<Lowercase<LANGS>, string>>({
  html: props.html,
  js: props.js,
  css: props.css,
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
</script>

<template>
  <div class="sandbox-run">
    <div class="sandbox-run__preview">
      <SandboxPreview :html="codes.html" :js="codes.js" :css="codes.css" />
      <div class="sandbox-run__preview__footer">
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
      </div>
    </div>
    <div>
      <SandboxCodeEditor
        ref="editorRef"
        :lang="activeType"
        @loaded="onToggleActiveType(activeType)"
        @update:html="(html) => (codes.html = html)"
        @update:js="(js) => (codes.js = js)"
        @update:css="(css) => (codes.css = css)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sandbox-run {
  background: #ffffff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 8px;

  &__preview {
    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__tabs {
    list-style: none;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;

    li {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;

      &:hover {
        background: #e2e8f0;
      }

      &.is-active {
        background: #cbd5e1;
      }
    }
  }
}
</style>
