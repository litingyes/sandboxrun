<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import SandboxPreview from './components/SandboxPreview.vue';
import SandboxCodeEditor from './components/SandboxCodeEditor.vue';
import type { LANGS } from './constant';
import ArrowDown from './icons/ArrowDown.vue';

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
  },
  props: sandboxRunProps,
  setup(props) {
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

    return {
      codes,
      codeEditTypes,
      activeType,
      editorRef,
      onToggleActiveType,
      showCode,
      showArrow,
    };
  },
});
</script>

<template>
  <div
    class="sandbox-run"
    @mouseenter="showArrow = true"
    @mouseleave="showArrow = false"
  >
    <div class="sandbox-run__preview">
      <SandboxPreview :codes="codes" />
    </div>
    <Transition name="fade">
      <div v-show="showCode">
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
        <SandboxCodeEditor
          ref="editorRef"
          :lang="activeType"
          @loaded="onToggleActiveType(activeType)"
          @update:html="(html) => (codes.html = html)"
          @update:js="(js) => (codes.js = js)"
          @update:css="(css) => (codes.css = css)"
        />
      </div>
    </Transition>
    <Transition name="fade">
      <ArrowDown
        v-show="showArrow"
        class="sandbox-run__arrow"
        :class="{ reverse: showCode }"
        @click="showCode = !showCode"
      />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.sandbox-run {
  position: relative;
  background: #ffffff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 8px;
  color: #0f172a;

  &__tabs {
    list-style: none;
    margin: 0;
    padding: 8px 0;
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
      // avoid override by vitepress style
      margin: 0;

      &:hover {
        background: #e2e8f0;
      }

      &.is-active {
        background: #cbd5e1;
      }
    }
  }

  &__arrow {
    background: white;
    position: absolute;
    border: 1px rgba(0, 0, 0, 0.25) solid;
    left: 50%;
    bottom: -12px;
    transform: translateX(-50%);
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s;
    color: #475569;

    &.reverse {
      transform: translateX(-50%) rotateX(180deg);
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
</style>
