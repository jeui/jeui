<template>
  <label :class="switchClass" @click="toggleSwitch" :style="wrapStyles">
    <span class="je-switch-inner">
      <slot name="open" v-if="checkStatus"></slot>
      <slot name="close" v-if="!checkStatus"></slot>
    </span>
    <input type="hidden" :name="name" :value="checkStatus">
  </label>
</template>


<script>
export default {
  name: 'jeSwitch',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    trueColor: {
      type: String,
      default: ""
    },
    falseColor: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
  },
  data () {
    return {
      checkStatus: this.value
    }
  },
  methods: {
    toggleSwitch () {
      if (this.disabled) return
      this.checkStatus = !this.checkStatus
      this.$emit('change', this.checkStatus)
    }
  },
  computed: {
    switchClass(){
      return [
        'je-switch',
        {
          ['je-switch-disabled']: this.disabled,
          ['je-switch-checked']: this.checkStatus
        }
      ]
    },
    wrapStyles () {
      let style = {};
      if (this.trueColor && this.checkStatus === this.trueValue) {
        style['background-color'] = this.trueColor;
      } else if (this.falseColor && this.checkStatus === this.falseValue) {
        style['background-color'] = this.falseColor;
      }
      return style;
    }
  }
}
</script>
