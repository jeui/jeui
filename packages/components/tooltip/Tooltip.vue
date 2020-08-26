<template>
  <div class="je-tooltip" v-clickOutside="hidePopover" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <span class="je-tooltip-trigger" ref="trigger"  @click="toggle" >
      <slot></slot>
    </span>

    <transition :name="transition">
      <div v-show="showTooltip"  ref="popper" :class="showTipClass">
        <div class="je-tooltip-content" :style="{width:width}">
          <slot name="content">
            <div v-text="content"></div>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import clickOutside from "../../utils/clickoutside";
import { getElementSize } from "../../utils/dom";
export default {
  name: "jeTooltip",
  directives: { clickOutside },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "auto"
    },
    trigger: {
      type: String,
      default: "hover"
    },
    transition: {
      type: String,
      default: "fade"
    },
    content: {
      type: String,
      default: ""
    },
    header: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: "top"
    }
  },
  data() {
    return {
      showTooltip: this.visible,
      position: {
        top: 0,
        left: 0
      },
      timeout:null
    };
  },
  watch:{
    visible(val){
      this.showTooltip = val
    }
  },
  mounted() {
    const trigger = this.$refs.trigger;
    
    if (this.trigger === "focus") {
      this.addEvent(trigger, "focus", this.showPopover);
      this.addEvent(trigger, "blur", this.hidePopover);
    }
  },
  methods: {
    toggle(evt) {
      this.showTooltip ? this.hidePopover() : this.showPopover()
      this.$emit("toggle", this.showTooltip);
    },
    showPopover() {
      this.showTooltip = true;
      // 将元素插入到Body中
      this.$nextTick(() => {
        this.setPopoverPosition();
      })
      this.$emit('update:visible', this.showTooltip);
    },
    hidePopover() {
      this.showTooltip = false;
    },
    //点击除弹出层外的空白区域隐藏面板
    concealPanel (e) {
      e.stopPropagation();
      const popper = this.$refs.popper;
      if (popper && !popper.contains(e.target)) {
        this.hidePopover()
      }
      
    },
    handleMouseEnter() {
      if (this.trigger === "hover") {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.showPopover();
        },50)
      }
    },
    handleMouseLeave() {
      if (this.trigger === "hover") {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.hidePopover();
        },50);
      }
    },
    setPopoverPosition() {
      this.$nextTick(() => {
        let popper = this.$refs.popper,
          trigger = this.$refs.trigger;
        let rect = getElementSize(trigger)
        switch (this.placement) {
          case "top":
            this.position.left = rect.left - popper.offsetWidth / 2  + rect.width / 2
            this.position.top = rect.top - popper.offsetHeight
            break;
          case "top-left":
            this.position.left = rect.left;
            this.position.top = rect.top - popper.offsetHeight;
            break;
          case "top-right":
            this.position.left = rect.left + rect.width - popper.offsetWidth;
            this.position.top = rect.top - popper.offsetHeight;
            break;
          case "left":
            this.position.left = rect.left - popper.offsetWidth;
            this.position.top = rect.top + rect.height / 2 - popper.offsetHeight / 2;
            break;
          case "left-top":
            this.position.left = rect.left - popper.offsetWidth;
            this.position.top = rect.top;
            break;
          case "left-bottom":
            this.position.left = rect.left - popper.offsetWidth;
            this.position.top = rect.top + rect.height - popper.offsetHeight;
            break;
          case "right":
            this.position.left = rect.left + rect.width;
            this.position.top = rect.top + rect.height / 2 - popper.offsetHeight / 2;
            break;
          case "right-top":
            this.position.left = rect.left + rect.width;
            this.position.top = rect.top;
            break;
          case "right-bottom":
            this.position.left = rect.left + rect.width;
            this.position.top = rect.top + rect.height - popper.offsetHeight;
            break;
          case "bottom":
            this.position.left = rect.left - popper.offsetWidth / 2 + rect.width / 2;
            this.position.top = rect.top + rect.height;
            break;
          case "bottom-left":
            this.position.left = rect.left;
            this.position.top = rect.top + rect.height;
            break;
          case "bottom-right":
            this.position.left = rect.left + rect.width - popper.offsetWidth;
            this.position.top = rect.top + rect.height;
            break;
          default:
            this.position.left = rect.left - popper.offsetWidth / 2 + rect.width / 2;
            this.position.top = rect.top - popper.offsetHeight;
            break;
        }

        popper.style.top = `${this.position.top}px`;
        popper.style.left = `${this.position.left}px`;
      });
    },
    addEvent(element, event, handler) {
      element.addEventListener(event, handler, false);
    }
  },
  computed:{
    showTipClass(){
      return [
        'je-tooltip-popper',
        {
          [`je-tooltip-${this.placement}`]: this.placement
        }
      ]
    }
  }
};
</script>
