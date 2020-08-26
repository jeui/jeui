<template>
  <div :class="classes" :style="styles" @click="back">
    <slot>
      <div :class="innerClasses">
        <i class="ivu-icon ivu-icon-ios-arrow-up"></i>
      </div>
    </slot>
  </div>
</template>

<script>
const scrollTop = function (el, from, to, duration, callback) {
  to = to || 0;
  duration = duration || 500;
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  var difference = Math.abs(from - to),
    step = Math.ceil((difference / duration) * 50);

  function scroll(start, end, step) {
    if (start === end) {
      typeof callback === "function" && callback();
      return;
    }
    var d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
    }
    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(function () {
      scroll(d, end, step);
    });
  }

  scroll(from, to, step);
};
const prefixCls = "je-backTop";

export default {
  name: "jeBackTop",
  props: {
    height: {
      type: Number,
      default: 400,
    },
    bottom: {
      type: Number,
      default: 30,
    },
    right: {
      type: Number,
      default: 30,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    duration: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      backTop: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, false);
    window.addEventListener("resize", this.handleScroll, false);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, false);
    window.removeEventListener("resize", this.handleScroll, false);
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-show`]: this.backTop,
        },
      ];
    },
    styles() {
      return {
        zIndex: this.zIndex,
        bottom: `${this.bottom}px`,
        right: `${this.right}px`,
      };
    },
    innerClasses() {
      return `${prefixCls}-inner`;
    },
  },
  methods: {
    handleScroll() {
      this.backTop = window.pageYOffset >= this.height;
    },
    back() {
      const sTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      scrollTop(window, sTop, 0, this.duration);
      this.$emit("on-click");
    },
  },
};
</script>
