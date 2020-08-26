<template>
  <div class="je-select-group" v-show="visible">
    <h3>{{ label }}</h3>
    <div class="je-select-group-list">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'jeOptionGroup',
    props: {
      label: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        visible: true
      };
    },
    created() {
      this.$on('on-group-change', this.queryChange);
    },
    methods: {
      queryChange() {
        this.visible = this.$children &&
          Array.isArray(this.$children) &&
          this.$children.some(option => option.showHide === true);
      }
    },
  }
</script>
