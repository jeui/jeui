<template>
  <div class="je-swiper-item" :style="{...itemStyle}" v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "jeSwiperItem",
  data() {
    return {
      itemStyle:{}
    };
  },
  methods: {}
};
</script>
