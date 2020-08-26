<template>
  <div style="width:100%;"></div>
</template>

<script>
// https://github.com/iq9891/ieditor
// http://nicedit.com/download.php
// https://github.com/luosijie/vm-editor
// https://github.com/BetaSu/my-vue-editor/blob/master/src/editor/editor.js
// https://blog.csdn.net/zshsats/article/details/88561075
// https://github.com/remembergf/Rich-text-editor/blob/master/text.html
import JEditor from "./editor/editor.js";
export default {
  name: "jeEditor",
  props: {
    value: {
      type: String,
      default: "<p>请输入内容</p>",
    },
  },
  data() {
    return {};
  },
  computed: {
    editContent: {
      get() {
        return this.value;
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.runEditor();
    });
  },
  methods: {
    runEditor() {
      new JEditor({
        elem: this.$el,
        content: this.editContent,
        onChange: (html) => {
          // this.editContent = html
          this.$emit("input", html);
        },
      });
    },
  },
};
</script>

