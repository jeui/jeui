<template>
  <div class="je-drawer" :class="{opendrawer:visible}">
    <div class="mask" @click="hideMask" :style="[maskStyle,{zIndex:zIndex}]"></div>
    <div class="wrap" :class="orien" :style="{width:drawerWidth,zIndex:zIndex+5}">
      <header class="drawer-head" v-if="$slots.header">
        <slot name="header"></slot>
      </header>
      <main class="drawer-content">
        <slot v-html="content"></slot>
      </main>
      <footer class="drawer-foot" v-if="$slots.footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script scoped>
export default {
  name: "jeDrawer",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    orien: {
      type: String,
      default: "left",
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    width: {
      type: Number,
      default: 300,
    },
    maskClose: {
      type: Boolean,
      default: true,
    },
    maskStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      drawerWidth: "0",
      visible: this.value,
    };
  },
  created() {
    this.drawerWidth = this.width <= 100 ? this.width + "%" : this.width + "px";
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("on-open", val);
    },
  },
  methods: {
    close() {
      this.handleClose();
    },
    hideMask() {
      if (this.maskClose) {
        this.handleClose();
      }
    },
    handleClose() {
      this.visible = false;
      this.$emit("input", false);
      this.$emit("on-close", false);
    },
  },
};
</script>

