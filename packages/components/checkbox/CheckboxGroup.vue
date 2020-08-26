<template>
  <div :class="groupClasss">
    <slot></slot>
  </div>
</template>

<script>
import { findComponentsDownward } from '../../utils/findComponent'
import Emitter from '../../utils/emitter'
export default {
  name: 'jeCheckboxGroup',
  mixins: [Emitter],
  props: {
    value: {
      type: Array,
      default: ()=> []
    },
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
  data () {
    return {
      currValue: this.value,
      childrens: []
    }
  },
  watch: {
    value (value) {
      this.updateModel()
    }
  },
  methods: {
    updateModel () {
      const value = this.value
      this.childrens = findComponentsDownward(this, 'jeCheckbox')
      if (this.childrens) {
        this.childrens.forEach(child => {
          child.model = value
          child.currValue = value.indexOf(child.label) >= 0
          child.isGroup = true
        })
      }
    },
    change (data) {
      this.currentValue = data
      this.$emit('input', data)
      this.$emit('change', data)
    }
  },
  mounted () {
    this.updateModel()
  },
  computed: {
    groupClasss(){
      return [
        'je-checkbox-group',
        {
          'je-checkbox-button': this.type === 'button'
        }
      ]
    }
  }
}
</script>
