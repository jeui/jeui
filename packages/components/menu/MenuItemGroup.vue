<template>
  <ul class="je-menu-item-group">
    <li class="je-menu-item-group-title" :style="itemStyle">{{ title }}</li>
    <ul class="je-menu-item-group-list">
      <slot></slot>
    </ul>
  </ul>
</template>

<script>
import MenuMixin from "./MenuMixin";
export default {
  name: "jeMenuItemGroup",
  mixins: [MenuMixin],
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.findParentLevel(this);
  },
  computed: {
    itemStyle() {
      return this.getpadValue();
    },
  },
};
</script>
