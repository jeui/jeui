<template>
  <label :class="checkboxClass">
    <input hidden v-if="isGroup" type="checkbox" class="je-checkbox-input"
      :disabled="disabled" :value="label" v-model="model" :name="name"
      @change="change" @focus="focus = true" @blur="focus = false">
    <input hidden v-else type="checkbox" class="je-checkbox-input"
      :disabled="disabled" :checked="currValue" :name="name"
      @change="change" @focus="focus = true" @blur="focus = false">
    <span class="je-checkbox-wrap" v-if="!isButton">
      <span :class="innerClass"></span>
    </span>
    <span class="je-checkbox-label" v-if="$slots.default || label !== ''">
      <slot>{{label}}</slot>
    </span>
  </label>
</template>

<script>
import { findComponentUpward } from '../../utils/findComponent'
import Emitter from '../../utils/emitter'
export default {
  name:"jeCheckbox",
  props: {
    value: {
      type: [String, Number, Boolean],
      default: false
    },
    label: {
      type: [String, Number, Boolean],
      default: ''
    },
    name: [String, Number],
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: [String, Number],
      default:'mini'
    },
    indeterminate: {
      type: Boolean,
      default: false
    }
  },
  mixins: [Emitter],
  data () {
    return {
      model: [],
      focus: false,
      isGroup: false,
      currValue: this.value,
      checkSize: this.size,
      parent: findComponentUpward(this, 'jeCheckboxGroup'),
      isButton: false,
      isBorder: false
    }
  },
  watch: {
    value (value) {
      this.updateModel()
    }
  },
  mounted () {
    if (this.parent) {
      if(this.parent.type === 'button'){
        this.isButton = true
      }
      if(this.parent.type === 'border'){
        this.isBorder = true
      }
      if(this.parent.size !== ''){
        this.checkSize = this.parent.size
      }
      this.isGroup = true
      this.parent.updateModel()
    } else {
      this.updateModel()
    }
    if (this.checked) {
      this.currValue = this.checked
    }
  },
  methods: {
    updateModel () {
      this.currValue = this.value
    },
    change (evt) {
      if (this.disabled) return false
      this.currValue = evt.target.checked
      this.$emit('input', this.currValue)
      if (this.isGroup) {
        this.parent.change(this.model)
      } else {
        this.$emit('change', this.currValue)
      }
    }
  },
  computed:{
    checkboxClass(){
      return [
        'je-checkbox',
        'je-align-center',
        'je-justify-left',
        {
          ['je-checkbox-checked']: this.currValue && !this.disabled,
          ['je-checkbox-button']: this.isButton,
          ['je-checkbox-normal']: !this.isButton ,
          ['je-checkbox-border']: this.isBorder,
          ['je-checkbox-disabled']: this.disabled,
          [`je-${this.checkSize}`]: this.checkSize
        }
      ]
    },
    innerClass(){
      return [
        'je-checkbox-inner', 
        {'indeterminate': this.indeterminate}
      ]
    }
  }
}
</script>

