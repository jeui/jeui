<template>
  <div class="je-image">
    <slot v-if="loading" name="placeholder">
      <div class="je-image__placeholder"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="je-image__error" v-if="!errorHtml">加载失败</div>
      <div class="je-image__inner" v-else v-html="errorHtml"></div>
    </slot>
    <img
      v-else
      class="je-image__inner"
      v-bind="$attrs"
      v-on="$listeners"
      @click="clickHandler"
      :src="src"
      :style="imageStyle"
      :class="{
        'je-image__inner--center': alignCenter,
        'je-image__preview': preview
      }"
    />
    <template v-if="preview">
      <image-viewer
        :z-index="zIndex"
        :initial-index="imageIndex"
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="previewSrcList"
      />
    </template>
  </div>
</template>

<script>
import ImageViewer from "./image-viewer";
import { on, off, getScrollContainer, isInContainer } from "../../utils/dom";
import { isString, isHtmlElement } from "../../utils/types";
const isSupportObjectFit = () =>
  document.documentElement.style.objectFit !== undefined;

const ObjectFit = {
  NONE: "none",
  CONTAIN: "contain",
  COVER: "cover",
  FILL: "fill",
  SCALE_DOWN: "scale-down",
};
let prevOverflow = "";

export default {
  name: "jeImage",
  components: {
    ImageViewer,
  },
  props: {
    src: String,
    fit: String,
    lazy: Boolean,
    scrollContainer: {},
    previewSrcList: {
      type: Array,
      default() { return [] },
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    errorHtml: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: true,
      error: false,
      show: !this.lazy,
      imageWidth: 0,
      imageHeight: 0,
      showViewer: false,
    };
  },
  computed: {
    imageStyle() {
      const { fit } = this;
      if (fit) {
        return isSupportObjectFit()
          ? { "object-fit": fit }
          : this.getImageStyle(fit);
      }
      return {};
    },
    alignCenter() {
      return !isSupportObjectFit() && this.fit !== ObjectFit.FILL;
    },
    preview() {
      const { previewSrcList } = this;
      return Array.isArray(previewSrcList) && previewSrcList.length > 0;
    },
    //算出图片的下标
    imageIndex() {
      let previewIndex = 0;
      const srcIndex = this.previewSrcList.indexOf(this.src);
      if (srcIndex >= 0) {
        previewIndex = srcIndex;
      }
      return previewIndex;
    },
  },
  mounted() {
    if (this.lazy) {
      this.addLazyLoadListener();
    } else {
      this.loadImage();
    }
  },
  methods: {
    // 点击预览
    clickHandler() {
      if (!this.preview) return;
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.showViewer = true;
    },
    // 关闭预览弹窗
    closeViewer() {
      document.body.style.overflow = prevOverflow;
      this.showViewer = false;
    },
    //实现图片的样式展示
    getImageStyle(fit) {
      const { imageWidth, imageHeight } = this;
      const {
        clientWidth: containerWidth,
        clientHeight: containerHeight,
      } = this.$el;
      if (!imageWidth || !imageHeight || !containerWidth || !containerHeight)
        return {};
      const vertical = imageWidth / imageHeight < 1;
    },
    //加载图片
    loadImage() {
      this.loading = true;
      this.error = false;
      const img = new Image();
      img.onload = (e) => this.handleLoad(e, img);
      img.onerror = this.handleError.bind(this);
      Object.keys(this.$attrs).forEach((key) => {
        const value = this.$attrs[key];
        img.setAttribute(key, value);
      });
      img.src = this.src;
    },
    handleLoad(e, img) {
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.loading = false;
      this.error = false;
    },
    handleError(e) {
      this.loading = false;
      this.error = true;
      this.$emit("error", e);
    },
    //懒加载
    addLazyLoadListener() {
      const { scrollContainer } = this;
      let _scrollContainer = null;
      if (isHtmlElement(scrollContainer)) {
        _scrollContainer = scrollContainer;
      } else if (isString(scrollContainer)) {
        _scrollContainer = document.querySelector(scrollContainer);
      } else {
        _scrollContainer = getScrollContainer(this.$el);
      }

      if (_scrollContainer) {
        this._scrollContainer = _scrollContainer;
        this._lazyLoadHandler = throttle(200, this.handleLazyLoad);
        on(_scrollContainer, "scroll", this._lazyLoadHandler);
        this.handleLazyLoad();
      }
    },
    //清除懒加载
    removeLazyLoadListener() {
      const { _scrollContainer, _lazyLoadHandler } = this;
      if (!_scrollContainer || !_lazyLoadHandler) return;
      off(_scrollContainer, "scroll", _lazyLoadHandler);
      this._scrollContainer = null;
      this._lazyLoadHandler = null;
    },
  },
};
</script>
