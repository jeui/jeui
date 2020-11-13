<template>
  <footer class="je-layouts-footer" :style="{height:height}">
    <slot></slot>
  </footer>
</template>

<script>
export default {
  name:"jeFooter",
  props: {
    height: {
      type: [String,Number],
      default: '60px'
    }
  }
}
</script>
