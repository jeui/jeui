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
      validator: (val) => ["left", "center", "right"].indexOf(val) > -1,
      default: "left"
    },
    dashed:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    dividerClass(){
      return [
        'je-divider',
        {
          [`nodivider`]: !this.$slots.default,
          [`je-divider-${this.type}`]: this.type,
          [`je-divider-${this.direction}`]: this.direction,
          ['dashed']: !!this.dashed
        }
      ]
    }
  }
}
</script>