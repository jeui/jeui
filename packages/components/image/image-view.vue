<!--
 * @Date: 2020-06-30 14:25:44
 * @LastEditors: Yeung
 * @LastEditTime: 2020-06-30 20:53:26
 * @Description: 给用户图片预览组件
--> 
<template>
  <div class="je-image-viewer-component">
    <template v-if="!isSingle && isUpdown">
      <span
        class="je-image-viewer__btn je-image-viewer__prev"
        :class="{ 'is-disabled': !infinite && isFirst }"
        @click="prev"
      >
        <je-icon type="icon-line-left" size="26" />
      </span>
      <span
        class="je-image-viewer__btn je-image-viewer__next"
        :class="{ 'is-disabled': !infinite && isLast }"
        @click="next"
      >
        <je-icon type="icon-line-right" size="26" />
      </span>
    </template>
    <div class="je-image-viewer__btn je-image-viewer__actions" v-if="isTool">
      <div class="je-image-viewer__actions__inner">
        <je-icon type="icon-zoom-out" @click="handleActions('zoomOut')" size="25" />
        <je-icon type="icon-zoom-in" @click="handleActions('zoomIn')" size="25" />
        <i class="je-image-viewer__actions__divider"></i>
        <je-icon type="icon-fullscreen" @click="toggleMode" size="25" />
        <i class="je-image-viewer__actions__divider"></i>
        <je-icon
          type="icon-shuaxin"
          @click="handleActions('clocelise')"
          style="transform: scaleX(-1)"
          size="25"
        />
        <je-icon type="icon-shuaxin" @click="handleActions('anticlocelise')" size="25" />
      </div>
    </div>
    <div class="je-image-viewer__canvas">
      <template v-for="(url, i) in urlList">
        <img
          v-if="i === index"
          ref="img"
          class="je-image-viewer__img"
          :key="url"
          :src="currentImg"
          :style="imgStyle"
        />
      </template>
    </div>
  </div>
</template>

<script>
const Mode = {
  CONTAIN: {
    name: "contain",
    icon: "el-icon-full-screen",
  },
  ORIGINAL: {
    name: "original",
    icon: "el-icon-c-scale-to-original",
  },
};

export default {
  name: "jeImageView",
  props: {
    urlList: {
      type: Array,
      default() { return [] },
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
    layout: {
      type: String,
      default: "updown, tool",
    },
  },
  data() {
    return {
      index: this.initialIndex,
      infinite: true,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
    };
  },
  computed: {
    isSingle() {
      return this.urlList.length <= 1;
    },
    isFirst() {
      return this.index === 0;
    },
    isTool() {
      const layoutStr = this.layout.replace(/\s*/g, "");
      return layoutStr.split(",").includes("tool");
    },
    isUpdown() {
      const layoutStr = this.layout.replace(/\s*/g, "");
      return layoutStr.split(",").includes("updown");
    },
    currentImg() {
      return this.urlList[this.index];
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`,
      };
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = "100%";
      }
      return style;
    },
  },
  methods: {
    prev() {
      if (this.isFirst && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index - 1 + len) % len;
    },
    next() {
      if (this.isLast && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index + 1) % len;
    },
    handleActions(action, options = {}) {
      if (this.loading) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options,
      };
      const { transform } = this;
      switch (action) {
        case "zoomOut":
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            );
          }
          break;
        case "zoomIn":
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case "clocelise":
          transform.deg += rotateDeg;
          break;
        case "anticlocelise":
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    },
    toggleMode() {},
  },
};
</script>
