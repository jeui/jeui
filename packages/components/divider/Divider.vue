<template>
  <div :class="dividerClass">
    <span class="je-inner-text" v-if="$slots.default && type==='horizontal'">
    <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "jeDivider",
  props: {
    type: {
      type: String,
      default: "horizontal"
    },
    direction: {
      type: String,
      default: "left"
    },
    dashed:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    dividerClass(){
      let that = this;
      return [
        'je-divider',
        {
          [`nodivider`]: !that.$slots.default,
          [`je-divider-${that.type}`]: that.type,
          [`je-divider-${that.direction}`]: that.direction,
          ['dashed']: !!that.dashed
        }
      ]
    }
  }
}
</script>