<template>
  <div :class="cardClass">
    <div class="je-card-title" v-if="$slots.title">
      <slot name="title"></slot>
    </div>
    <div class="je-card-content" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "jeCard",
  props: {
    bordered: {
      type: Boolean,
      default: true,
    },
    // always / hover / never
    shadow: {
      type: String,
      default: "hover",
    },
    padding: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    cardClass() {
      return [
        "je-card",
        {
          ["je-card-border"]: this.bordered,
          [`je-card-${this.shadow}-shadow`]: this.shadow != "",
        },
      ];
    },
    bodyStyle() {
      return {
        padding: `${this.padding}px`,
      };
    },
  },
};
</script>

