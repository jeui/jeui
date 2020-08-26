<template>
  <li :class="menuItemClass" @click="handleClick">
    <template v-if="Object.keys(path).length">
    <router-link tag="p" class="je-menu-item-link" :to="path" :style="itemStyle" exact>
      <slot></slot>
    </router-link>
    </template>
    <div v-else class="je-menu-item-link" :style="itemStyle">
      <slot></slot>
    </div>
  </li>
</template>

<script>
import { findComponentsUpward } from "../../utils/findComponent";
import Emitter from "../../utils/emitter";
import MenuMixin from "./MenuMixin";
export default {
  name: "jeMenuItem",
  mixins: [Emitter,MenuMixin],
  props: {
    name: {
      type: [String, Number],
    },
    path: {
      type: [String, Object],
      default() { return {} },
    },
    replace: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: false,
    };
  },
  methods: {
    handleClick(evt) {
      evt.preventDefault();
      if (this.disabled) return;
      const parents = findComponentsUpward(this, "jeSubmenu");
      if (parents && parents.length) {
        parents.forEach((parent) => {
          parent.$emit("on-menu-item-select", this);
        });
      } else {
        this.dispatch("jeMenu", "on-menu-item-select", this);
      }
    },
  },
  mounted() {
    this.findParentLevel(this);
    this.$on("on-update-active", (name) => {
      this.$nextTick(() => {
        if ( this.name === name) {
          this.active = true;
          const parents = findComponentsUpward(this, "jeSubmenu");
          if (parents && parents.length) {
            parents.forEach((parent) => {
              parent.$emit("on-update-active", true);
            });
          }
        } else {
          this.active = false;
        }
      });
    });
  },
  computed: {
    menuItemClass() {
      return [
        "je-menu-item",
        {
          ["je-menu-item-active"]: this.active,
          ["je-menu-item-disabled"]: this.disabled,
        },
      ];
    },
    itemStyle() {
      return this.getpadValue();
    },
  },
};
</script>
