<template>
  <div class="je-dropdown">
    <div
      class="je-dropdown-title"
      @mouseenter="handleMouseenter"
      @mouseleave="handleMouseleave"
      @click.stop="handleClick"
      @contextmenu.prevent="handleRightClick"
    >
      <slot></slot>
    </div>
    <slot v-bind="$attrs" :style="openStyle" name="dropDown"></slot>
  </div>
</template>

<script>
import { setElementSize } from "../../utils/dom";
import { findComponentDownward } from "../../utils/findComponent";
export default {
  name: "jeDropDown",
  props: {
    trigger: {
      type: String,
      default: "hover",
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
  },
  data() {
    return {
      visible: false,
      openStyle: {},
    };
  },
  mounted() {
    this.$on("drop-down-click", this.dropDownMenu);
  },
  methods: {
    dropDownMenu(command, instance) {
      this.$emit("command", command, instance);
    },
    handleMouseenter() {
      if (this.trigger == "hover") {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.handleMenu(true);
        }, 50);
      }
    },
    handleMouseleave() {
      if (this.trigger == "hover") {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.handleMenu(false);
          }, 50);
        }
      }
    },
    handleClick() {
      if (this.trigger == "click") {
        this.handleMenu(true);
      }
    },
    handleRightClick() {
      if (this.trigger == "contextMenu") {
        this.handleMenu(true);
      }
    },
    handleMenu(isShow) {
      let dropDown = findComponentDownward(this, "jeDropDownMenu");
      dropDown.visible = isShow;
      if (isShow) {
        // 将元素插入到Body中
        // document.body.appendChild(dropDown.$el)
        this.$nextTick(() => {
          let down = setElementSize(this.$el, dropDown.$el);
          dropDown.openStyle = Object.assign(
            { zIndex: 9999 },
            { width: "auto", top: down.top, left: down.left }
          );
          document.addEventListener(
            "click",
            (e) => {
              this.concealPanel(e, dropDown.$el);
            },
            false
          );
        });
      } else {
        document.removeEventListener(
          "click",
          (e) => {
            this.concealPanel(e, dropDown.$el);
          },
          false
        );
      }
    },
    //点击除弹出层外的空白区域隐藏面板
    concealPanel(e, elem) {
      e.stopPropagation();
      if (elem && !elem.contains(e.target)) {
        this.handleMenu(false);
      }
    },
  },
  destroyed() {
    document.removeEventListener(
      "click",
      (e) => {
        this.concealPanel(e, dropDown.$el);
      },
      false
    );
  },
};
</script>

