<template>
  <aside class="je-layouts-sider" :style="wrapStyles">
    <div :class="childClasses">
      <slot></slot>
    </div>
  </aside>
</template>

<script>
export default {
  name:"jeSider",
  props:{
    value: {  
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: 200
    },
  },
  computed:{
    childClasses () {
      return 'je-layouts-sider-children';
    },
    wrapStyles () {
      return {
        width: `${this.width}px`,
        minWidth: `${this.width}px`,
        maxWidth: `${this.width}px`,
        flex: `0 0 ${this.width}px`
      };
    },
  },
  methods:{
    toggleCollapse () {
      let value = this.collapsible ? !this.value : false;
      this.$emit('input', value);
    },
  }
}
</script>

