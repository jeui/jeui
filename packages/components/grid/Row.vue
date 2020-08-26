<template>
  <div :class="gridClass" :style="gridStyles">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name:"jeRow",
  props:{
    type:{
      type: String,
      default: ''
    },
    align:{
      type: String,
      default: ''
    },
    justify:{
      type: String,
      default: ''
    },
    gutter: {
      type: Number,
      default: 0
    },
  },
  computed: {
    gridClass(){
      let that = this;
      return [
        'je-row',
        {
          [`je-${that.type}`]: !!that.type,
          [`je-align-${this.align}`]: !!this.align,
          [`je-justify-${this.justify}`]: !!this.justify,
        }
      ]
    },
    gridStyles() {
      let that = this, style = {};
      if (that.gutter !== 0) {
        style = {
          marginLeft: that.gutter / -2 + 'px',
          marginRight: that.gutter / -2 + 'px'
        };
      }
      return style;
    }
  },
  watch: {
    gutter (val) {
      this.updateGutter(val);
    }
  },
  methods: {
    updateGutter (val) {
      this.$children.forEach(child => {
        if (child.$options.name === 'jeCol' && val != 0) {
          child.gutter = val;
        }
      })
    }
  },
}
</script>
