<template>
  <transition name="jefade" @after-enter="afterEnter" @after-leave="afterLeave">
    <section class="je-layer" :style="wrapStyle" v-if="visibleLayer" :key="key">
      <article class="je-layer-mask" v-if="mask" :style="maskStyle" @click="handleMaskClick"></article>
      <section class="je-layer-box" :style="modelStyle" ref="laycell">
        <span class="layer-close" v-if="closeBtn" @click="handleCloseClick">
          <Icon :type="closeIcon" size="18px" />
        </span>
        <header
          class="layer-head"
          v-if="title"
          :style="[{cursor:drag?'move':''},titleStyle]"
          @mousedown="handleDrag($event)"
        >
          <Icon :type="titleIcon" size="32px" class="je-mr10" v-if="titleIcon !==''" />
          <h3>
            <template v-if="$slots.title">
              <slot name="title"></slot>
            </template>
            <span v-else v-html="showTitle"></span>
          </h3>
        </header>
        <main class="layer-body" :class="{ splitline: line }" :style="mainStyle">
          <template v-if="$slots.default">
            <slot></slot>
          </template>
          <div v-else class="bodyhtml" v-html="content"></div>
        </main>
        <footer class="layer-foot" :style="footStyle" v-if="$slots.footer || button.length > 0">
          <template v-if="$slots.footer">
            <slot name="footer"></slot>
          </template>
          <div v-else :style="rowStyle">
            <template v-for="(val, index) in button">
              <je-button
                :type="val.type ? val.type : (index == 0 ? 'primary' : 'default')"
                :disabled="val.disabled ? val.disabled : false"
                @click="handleButton(val.callback, index)"
                :key="index"
              >{{ val.name }}</je-button>
            </template>
          </div>
        </footer>
      </section>
    </section>
  </transition>
</template>

<script>
import Emitter from "../../utils/emitter";
import Icon from "../icon/Icon";
let LayerIndex = 0,
  regPxe = /\px|em|rem/g;
export default {
  name: "jeLayer",
  mixins: [Emitter],
  components: {
    Icon,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    // 标题可以有2个参数，例如 ["标题",{"background-color":"#fff","color":"#fff"}]，如果title:[]参数为空，不显示标题
    title: {
      type: [String, Boolean, Array],
      default: "提示信息",
    },
    titleIcon: {
      type: String,
      default: "",
    },
    closeIcon: {
      type: String,
      default: "icon-normal-close",
    },
    // 弹层的宽度，可用是百分比，可用是如（320px）
    width: {
      type: String,
      default: "320px",
    },
    // 弹层的高度，可用是百分比，可用是如（320px）
    height: {
      type: String,
      default: "auto",
    },
    // 显示内容
    content: {
      type: String,
      default: "请稍等,暂无内容！",
    },
    //内容外框的css样式，你可以写更多样式，例如{"background-color":"#fff"}
    boxStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //内容框的css样式，你可以写更多样式，例如{"background-color":"#fff"}
    bodyStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    position: {
      type: String,
      default: "fixed",
    },
    // 各按钮回调函数，例如{name:"确定",css:{"background-color":"#fff"},callback:function (){}}
    button: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //按钮排序，正序：true，倒序：false
    buttonSort: {
      type: Boolean,
      default: false,
    },
    //按钮对齐，左对齐：left，居中：center，右对齐：right
    buttonAlign: {
      type: String,
      default: "right",
    },
    line: {
      type: Boolean,
      default: false,
    },
    // 自动关闭时间(毫秒)
    time: {
      type: Number,
      default: 0,
    },
    closeBtn: {
      type: Boolean,
      default: true,
    },
    //是否显示遮罩层
    mask: {
      type: Boolean,
      default: true,
    },
    // 点击遮罩层是否关闭，默认true
    maskClose: {
      type: Boolean,
      default: true,
    },
    // 遮罩层颜色可以是rgba也可以是rgb
    maskColor: {
      type: String,
      default: "rgba(0,0,0,0.4)",
    },
    // 层级关系
    zIndex: {
      type: Number,
      default: 1000,
    },
    // 是否可以拖拽
    drag: {
      type: Boolean,
      default: false,
    },
    // 是否将弹层插入到元素中
    appendBody: {
      type: [Object, Boolean, Element],
      default: () => {
        return document.body;
      },
    },
    //层成功弹出层的回调函数，返回一个参数为当前层元素对象
    // success: Function
  },
  data() {
    return {
      key: 0,
      showLayer: this.value,
      showTitle: "",
      titleStyle: {},
      animActiov: false,
      layerWidth: "0px",
      layerHeight: "0px",
      //左对齐：flex-end，居中：center，右对齐：flex-start
      align: {
        left: "flex-start",
        center: "center",
        right: "flex-end",
      },
      moveTop: "",
      moveLeft: "",
    };
  },
  mounted() {
    LayerIndex++;
    this.initLayer();
    document.addEventListener("keydown", this.handleKeyCode);
  },
  watch: {
    value(val) {
      this.moveTop = "";
      this.moveLeft = "";
      this.showLayer = val;
      this.handleShowHide(val);
    },
    visible(val) {
      this.moveTop = "";
      this.moveLeft = "";
      this.handleShowHide(val);
    },
  },
  methods: {
    initLayer() {
      let isTitleArr = Array.isArray(this.title) && this.title.length > 0;
      let winWidth = document.body.clientWidth,
        winHeight = document.body.clientHeight;
      let bsWidth = parseInt(this.width.replace(regPxe, ""));
      let bsHeight = parseInt(this.height.replace(regPxe, ""));
      this.showTitle = isTitleArr ? this.title[0] : this.title;
      this.titleStyle = isTitleArr && this.title[1] ? this.title[1] : {};
      this.layerWidth = bsWidth > winWidth ? winWidth : this.width;
      this.layerHeight = bsHeight > winHeight ? winHeight : this.height;
      if (this.showLayer || this.visible) {
        this.$nextTick(() => this.openLayer());
      }
    },
    handleShowHide(val) {
      if (val) {
        this.$nextTick(() => {
          this.openLayer();
        });
      } else {
        this.$nextTick(() => {
          this.closeLayer();
          this.key++;
        });
      }
    },
    openLayer() {
      this.$emit("open");
      if (this.appendBody) {
        this.appendBody.appendChild(this.$el);
      }
      this.$nextTick(() => {
        this.open && this.open(this);
        this.time > 0 && setTimeout(this.close, this.time * 1000);
      });
    },
    closeLayer() {
      this.$emit("input", false);
      this.$emit("close");
    },
    handleCloseClick() {
      if (this.showLayer) {
        this.$emit("input", false);
        this.key++;
        this.showLayer = false;
      }
      if (this.visible) {
        this.$emit("update:visible", false);
      }
      this.$nextTick(() => {
        this.close && this.close(this);
      });
    },
    handleMaskClick() {
      if (this.maskClose) {
        this.handleCloseClick();
      }
    },
    handleKeyCode(evt) {
      if (this.visibleLayer) {
        if (evt.keyCode === 27) {
          // Escape
          this.handleCloseClick();
        }
      }
    },
    handleButton(callback, idx) {
      if (idx == 0) {
        callback instanceof Function ? callback(this) : this.handleCloseClick();
      } else {
        if (callback instanceof Function) callback(this);
        this.handleCloseClick();
      }
    },
    handleDrag(event) {
      if (this.drag) {
        let tmpX = 0,
          tmpY = 0,
          dmpX = 0,
          dmpY = 0,
          elbox = this.$refs.laycell,
          isMoveable = true;
        //FireFox 去除容器内拖拽图片问题
        if (event.preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        let winWidth = document.body.clientWidth,
          winHeight = document.body.clientHeight,
          boxWidth = elbox.offsetWidth,
          boxHeight = elbox.offsetHeight,
          elTop = elbox.offsetTop,
          elLeft = elbox.offsetLeft;
        tmpX = event.pageX - elLeft;
        tmpY = event.pageY - elTop;
        document.onmousemove = (ev) => {
          window.getSelection
            ? window.getSelection().removeAllRanges()
            : document.selection.empty();
          //控制元素不被拖出窗口外
          let event = ev || window.event,
            maxW = winWidth - boxWidth,
            maxH = winHeight - boxHeight;
          (dmpX = event.pageX - tmpX), (dmpY = event.pageY - tmpY);
          dmpX <= 0 && (dmpX = 0);
          dmpY <= 0 && (dmpY = 0);
          dmpX >= maxW && (dmpX = maxW);
          dmpY >= maxH && (dmpY = maxH);
          this.moveTop = dmpY + "px";
          this.moveLeft = dmpX + "px";
        };
        document.onmouseup = () => {
          if (isMoveable) {
            tmpX = tmpY = 0;
            isMoveable = false;
          }
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    afterEnter() {
      this.$emit("opened");
    },
    afterLeave() {
      this.$emit("closed");
    },
  },

  computed: {
    visibleLayer() {
      return this.visible ? this.visible : this.showLayer;
    },
    maskStyle() {
      return {
        zIndex: 10,
        backgroundColor: this.maskColor,
      };
    },
    wrapStyle() {
      return {
        position: this.position,
        zIndex: this.zIndex + LayerIndex,
      };
    },
    modelStyle() {
      let topleft = this.drag
        ? {
            top: this.moveTop,
            left: this.moveLeft,
          }
        : {};
      return Object.assign(
        {
          borderRadius:
            this.width == "100%" && this.height == "100%" ? 0 : "5px",
          backgroundColor: "#ffffff",
          zIndex: 10 + LayerIndex,
          width: this.layerWidth,
          height: this.layerHeight,
        },
        topleft,
        this.boxStyle
      );
    },
    mainStyle() {
      return Object.assign(
        {
          padding: "15px 10px",
        },
        this.bodyStyle
      );
    },
    footStyle() {
      return {
        padding: "10px",
        justifyContent: this.align[this.buttonAlign],
      };
    },
    rowStyle() {
      return {
        display: "flex",
        flexDirection: this.buttonSort ? "row" : "row-reverse",
      };
    },
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeyCode);
    if (this.appendBody && this.$el) {
      this.$el.remove();
    }
  },
};
</script>
