<template>
  <i :class="iconClass" :style="iconStyle" @click="handleClick"></i>
</template>
<script>
  export default {
    name: 'jeIcon',
    props: {
      type: {
        type: String,
        default: ''
      },
      size:{
        type: [Number, String],
        default: '14'
      }, 
      color: {
        type: String,
        default: ''
      },
      custom: {
        type: String,
        default: ''
      }
    },
    computed: {
      iconClass() {
        return [
          'je-icon',
          {
            [`${this.type}`]: this.type !== '',
            [`${this.custom}`]: this.custom !== '',
          }
        ];
      },
      iconStyle() {
        let style = {};
        if (this.size) {
          style['font-size'] = /^[0-9]*$/.test(this.size) ? `${this.size}px` : `${this.size}`;
        }
        if (this.color) {
          style.color = this.color;
        }
        return style;
      }
    },
    methods: {
      handleClick(event) {
        this.$emit('click', event);
      }
    }
  };

</script>
