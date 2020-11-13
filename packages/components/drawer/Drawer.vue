<template>
  <transition name="drawer-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div class="je-drawer" :class="visible && 'drawer-open'" :style="drawerStyle" v-show="visible">
      <div class="drawer-mask" :class="{opendmask:visible}" @click="clickMask"></div>
      <div class="drawer-wrap" :class="`drawer-${direction}`" :style="wrapStyle">
        <header class="drawer-head" v-if="$slots.header || title">
          <slot name="header">{{title}}</slot>
        </header>
        <main class="drawer-content">
          <slot></slot>
        </main>
        <footer class="drawer-foot" v-if="$slots.footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script scoped>
export default {
  name: "jeDrawer",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      validator(val){
        return ['left', 'right', 'top', 'bottom'].indexOf(val) > -1;
      },
      default: "left",
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    size: {
      type: String,
      default: '300px',
    },
    title: {
      type: String,
      default: ''
    },
    maskClose: {
      type: Boolean,
      default: true,
    },
    // 是否将弹层插入到元素中
    appendBody: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function
    },
  },
  data() {
    return {
      closed: false,
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        if (this.appendBody) {
          document.body.appendChild(this.$el);
        }
      }else{
        if (!this.closed) {
          this.$emit('close');
        } 
      }
    },
  },
  methods: {
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    },
    close() {
      this.$emit('update:visible', false);
      this.$emit('close');
      this.closed = true;
    },
    clickMask() {
      if (this.maskClose) {
        this.closeDrawer();
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.close);
      } else {
        this.close();
      }
    },
  },
  computed: {
    drawerStyle() {
      return {zIndex: this.zIndex}
    },
    wrapStyle() {
      let direction = this.direction === 'left' || this.direction === 'right';
      let objs = direction ? {width:this.size} : {height:this.size}
      return objs
    }
  },
  destroyed() {
    if (this.appendBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>

