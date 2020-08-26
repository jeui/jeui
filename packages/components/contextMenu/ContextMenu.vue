<template>
  <div class="je-context-menu" v-show="visible"
    style="display: block;" :style="menuStyle"
    @mousedown.stop @contextmenu.prevent
  >
    <slot></slot>
  </div>
</template>

<script>
// <context-menu class="right-menu" 
//     :target="contextMenuTarget" 
//     :visible="contextMenuVisible" 
//     @update:visible="(show) => contextMenuVisible = show">
//     <a href="javascript:;" @click="copyMsg">复制</a>
//     <a href="javascript:;" @click="quoteMsg">引用</a>
//     <a href="javascript:;" @click="deleteMsg">删除</a>
// </context-menu>
export default {
  name: "jeContextMenu",
  props: {
    target: null,
    visible: {
      type: Boolean,
      default: false
    },
  },
  mounted() {
    this.bindEvents();
  },
  data() {
    return {
      triggerShowFn: () => {},
      triggerHideFn: () => {},
      left: null,
      top: null,
      menuStyle: {},
      binded: false,
    };
  },
  watch: {
    visible(show) {
      show ? this.bindHideEvents() : this.unbindHideEvents();
    },
    target(target) {
      this.bindEvents();
    },
  },
  methods: {
    // 初始化事件
    bindEvents() {
      this.$nextTick(() => {
        if (!this.target || this.binded) return;
        this.triggerShowFn = this.contextMenuHandler.bind(this);
        this.target.addEventListener("contextmenu", this.triggerShowFn);
        this.binded = true;
      });
    },
    // 取消绑定事件
    unbindEvents() {
      if (!this.target) return;
      this.target.removeEventListener("contextmenu", this.triggerShowFn);
    },
    // 绑定隐藏菜单事件
    bindHideEvents() {
      this.triggerHideFn = this.clickDocumentHandler.bind(this);
      document.addEventListener("mousedown", this.triggerHideFn);
      document.addEventListener("mousewheel", this.triggerHideFn);
    },
    // 取消绑定隐藏菜单事件
    unbindHideEvents() {
      document.removeEventListener("mousedown", this.triggerHideFn);
      document.removeEventListener("mousewheel", this.triggerHideFn);
    },
    // 鼠标按压事件处理器
    clickDocumentHandler(e) {
      this.$emit("update:visible", false);
    },
    // 右键事件事件处理
    contextMenuHandler(e) {
      this.left = e.clientX;
      this.top = e.clientY;
      this.layoutHandler();
      this.$emit("update:visible", true);
      e.preventDefault();
    },
    // 布局
    layoutHandler() {
      this.menuStyle = {
        left: this.left + "px",
        top: this.top + "px",
      };
    },
  },
  destroyed() {
    this.unbindHideEvents()
  }
};
</script>


