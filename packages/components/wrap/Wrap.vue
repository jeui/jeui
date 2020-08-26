<template>
  <div class="je-conwrap" :class="auto?'auto':'bespread'" :style="{width: width}">
    <div class="je-block-wrap" :class="shadow?'shadow':''">
      <div class="je-block-head" v-if="$slots.header"><slot name="header"></slot></div>
      <div class="je-block-body"><slot></slot></div>
      <div class="je-block-foot" v-if="$slots.footer"><slot name="footer"></slot></div>
    </div>
  </div>
</template>

<script>
export default {
  name:"JeWrap",
  props:{
    width: {
      type: String,
      default: '100%'
    },
    auto:{
      type: Boolean,
      default: true
    },
    shadow:{
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
    }
  }
}
</script>


<style>

</style>

