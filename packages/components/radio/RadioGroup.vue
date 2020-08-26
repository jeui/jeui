<template>
  <div :class="groupClasss" :name="name">
    <slot></slot>
  </div>
</template>

<script>
import Emitter from '../../utils/emitter'
export default {
  name:"jeRadioGroup",
  props:{
    value: [String, Number, Boolean],
    type: {
      type: String,
      default: ''
    },
    name: [String, Number],
    size: {
      type: [String, Number],
      default:''
    },
  },
  mixins: [Emitter],
  watch: {
    value (value) {
      this.$emit('change', value)
      this.broadcast('jeRadio', 'initRadio', value)
    }
  },
  mounted () {
    this.broadcast('jeRadio', 'initRadio', this.value)
  },
  computed: {
    groupClasss(){
      return [
        'je-radio-group',
        {
          'je-radio-button': this.type === 'button'
        }
      ]
    }
  }
}
</script>

