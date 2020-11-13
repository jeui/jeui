<template>
  <li ref="trigger" :class="submenuClass" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="je-menu-submenu-title" ref="reference" @click.stop="toggleMenu">
      <div class="je-menu-submenu-caption">
        <slot name="title"></slot>
      </div>
      <Icon custom="je-f14 je-fr je-menu-submenu-arrows" type="icon-movedown"></Icon>
    </div>
    <FoldAnimate v-if="mode === 'inline'">
      <ul class="je-menu" v-show="openMenu">
        <slot></slot>
      </ul>
    </FoldAnimate>
    <transition name="slide-up" v-else>
      <div class="je-menu-dropdown-popover" :style="dropStyle"
        ref="popover" v-show="$slots.default && openMenu"
      >
        <ul class="je-menu-dropdown-menu">
          <slot></slot>
        </ul>
      </div>
    </transition>
  </li>
</template>

<script>
import FoldAnimate from "../../utils/foldAnimate";
import { findComponentUpward } from "../../utils/findComponent";
import Emitter from "../../utils/emitter";
import Icon from "../icon/Icon.vue";

export default {
  name: "jeSubmenu",
  components: {
    Icon,
    FoldAnimate,
  },
  mixins: [Emitter],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: false,
      openMenu: this.opened,
      dropWidth: null, 
      parentMenu: findComponentUpward(this, "jeMenu"),
    };
  },
  watch: {
    mode(val) {
      if (val !== "inline") {
        this.openMenu = false;
        // this.handleMouseLeave()
      }
    },
    openMenu(val) {
      if (this.mode === "inline") return;
      if (val) {
        this.dropWidth = this.parentMenu.width;
        this.setDropPosition();
      }
    },
  },
  mounted() { 
    this.dropWidth = this.parentMenu.width,
    this.$on("on-menu-item-select", (name) => {
      if (this.mode !== "inline") {
        this.openMenu = false;
      }
      this.dispatch("jeMenu", "on-menu-item-select", name);
    });
    this.$on("on-update-active", (status) => {  
      this.active = status;
    });
  },
  methods: {
    setDropPosition() {
      const popover = this.$refs.popover;
      const trigger = this.$refs.trigger;
      const parent = this.$parent;
      const name = parent.$options.name;
      if (this.mode === "vertical") {
        popover.style.left = "initial";
        popover.style.right = `-${trigger.offsetWidth + 4}px`;
        popover.style.top = "0";
      } else if (parent && name !== "jeSubmenu") {
        popover.style.left = "0";
        popover.style.right = "initial";
        popover.style.top = `${trigger.offsetHeight + 2}px`;
      } else {
        popover.style.left = "initial";
        popover.style.right = `-${trigger.offsetWidth + 4}px`;
        popover.style.top = "0";
      }
    },
    toggleMenu() {
      if(!this.$slots.default) this.disabled = true;
      if (this.disabled || this.mode !== "inline") return;
      const opened = this.openMenu;
      if (this.inlineCollapsed) {
        this.parentMenu.$children.forEach((item) => {
          if (item.$options.name === "jeSubmenu") {
            item.openMenu = false;
          }
        });
      }
      this.openMenu = !opened;
    },
    handleMouseEnter() {
      if (this.disabled || this.mode === "inline") return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.openMenu = true;
      }, 100);
    },
    handleMouseLeave() {
      if (this.disabled || this.mode === "inline") return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.openMenu = false;
      }, 100);
    },
  },
  computed: {
    mode() {
      return this.parentMenu.mode;
    },
    inlineCollapsed() {
      return this.parentMenu.inlineCollapsed;
    },
    dropStyle() {
      return {
        "min-width": this.dropWidth,
      };
    },
    placementValue() {
      return this.mode === "vertical" ? "right-top" : "bottom";
    },
    submenuClass() {
      return [
        "je-menu-submenu",
        {
          ["je-menu-submenu-active"]: this.active,
          ["je-menu-submenu-opened"]: this.openMenu,
          ["je-menu-submenu-disabled"]: this.disabled,
        },
      ];
    },
  },
};
</script>
