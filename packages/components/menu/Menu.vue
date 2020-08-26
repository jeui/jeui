<template>
  <ul :class="menuClass" :style="ulStyle">
    <slot></slot>
  </ul>
</template>

<script>
import Emitter from "../../utils/emitter";
import { findComponentsDownward } from "../../utils/findComponent";
export default {
  name: "jeMenu",
  mixins: [Emitter],
  props: {
    width: {
      type: String,
      default: "240px",
    },
    router: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "inline",
      validator: (val) => ["inline", "horizontal", "vertical"].indexOf(val) > -1,
    },
    theme: {
      type: String,
      default: "light",
      validator: (val) => ["light", "dark"].indexOf(val) > -1,
    },
    activeName: [String, Number],
    inlineCollapsed: {
      type: Boolean,
      default: false,
    },
    expand: {
      type: Array,
      default() { return [] },
    },
    expandAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currActiveName: this.activeName,
    };
  },
  
  watch: {
    activeName(val) {
      this.currActiveName = val;
    },
    currActiveName() {
      this.updateActiveName();
    },
  },
  mounted() {
    if(this.expandAll && this.mode === "inline") {
      this.expandAllMenu()
    } 
    this.updateActiveName();
    this.$on("on-menu-item-select", (item) => {
      this.currActiveName = item.name;
      this.$emit("select", item);
      if (this.router) {
        this.routeMenuItem(item);
      }
    });
  },
  methods: {
    expandAllMenu() {
      this.$children.forEach((val, idx) => {
        if (val.$children.length > 0 && val.$options.name == "jeSubmenu") {
          val.openMenu = true;
          val.defaultStatus = true;
        }
      });
    },
    updateActiveName() {
      if (typeof this.currActiveName === "undefined") {
        this.currActiveName = -1;
      }
      const submenus = findComponentsDownward(this, "jeSubmenu");
      if (submenus && submenus.length) {
        submenus.forEach((submenu) => {   
          submenu.$emit("on-update-active", false);
        });
      }
      this.broadcast("jeMenuItem", "on-update-active", this.currActiveName);
    },
    routeMenuItem(item) {
      const route = item.to || {};
      item.replace ? this.$router.replace(route) : this.$router.push(route);
    },
  },
  
  computed: {
    menuClass() {
      return [
        "je-menu",
        {
          [`je-menu-${this.theme}`] : this.theme,
          [`je-menu-${this.mode}`] : this.mode
        }
      ]
    },
    ulStyle() {
      let style = {};
      if (this.mode === "inline" || this.mode === "vertical") {
        style.width = this.width;
      }
      return style;
    },
  },
};
</script>
