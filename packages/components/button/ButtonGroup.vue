<template>
  <div class="je-btn-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "jeButtonGroup",
  methods: {
    setChildrenRound() {
      let children = this.$children;
      if (children.length > 0) {
        children.forEach((val, idx) => {
          if (idx == 0) {
            val.roundValue = `${val.round} 0px 0px ${val.round}`;
          } else if (idx == children.length - 1) {
            val.roundValue = `0px ${val.round} ${val.round} 0px`;
          } else {
            val.roundValue = "0px";
          }
        });
      }
    },
  },
};
</script>
