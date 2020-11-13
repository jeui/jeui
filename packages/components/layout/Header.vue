<template>
  <header class="je-layouts-header" :style="{height:height}">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name:"jeHeader",
  props: {
    height: {
      type: [String,Number],
      default: '60px'
    }
  }
}
</script>
