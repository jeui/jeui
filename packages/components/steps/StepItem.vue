<template>
  <div class="je-step-item" :class="stepStatusClass">
    <div class="je-steps-mark"> 
      <span class="stepicon" v-if="icon != ''"><Icon :type="icon"></Icon></span>
      <template v-else>
        <span class="stepicon" v-if="['process', 'wait'].indexOf(finalStatus) > -1" v-text="stepIndex+1"></span>
        <span class="stepicon" v-if="finalStatus === 'finish'"><Icon type="icon-draw"></Icon></span>
        <span class="stepicon" v-if="finalStatus === 'error'"><Icon type="icon-normal-close"></Icon></span>
      </template>
      <span class="steptext" v-text="title"></span>
    </div>
    <div class="je-steps-desc je-c9" v-if="$slots.default">
      <slot>{{description}}</slot>
    </div>
  </div>
</template>

<script>
import Icon from '../icon/Icon'
export default {
  name: "jeStepItem",
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      validator(val){
        return ['wait', 'process', 'finish', 'error'].indexOf(val) > -1
      }
    }
  },
  components: {
    Icon
  },
  data () {
    return {
      stepIndex: 0,
      internalStatus: ""
    }
  },
  mounted () {

  },
  computed: {
    finalStatus() {
      return this.status || this.internalStatus
    },
    stepStatusClass() {
      const className = {}
      switch (this.internalStatus) {
        case 'process':
          className['je-step-process'] = true
          break
        case 'wait':
          className['je-step-wait'] = true
          break
        case 'finish':
          className['je-step-finish'] = true
          break
        case 'error':
          className['je-step-error'] = true
          break
      }
      return className
    },
    stepsClass(){
      return [
        'je-steps-item',
      ]
    }
  },
  beforeCreate () {
    this.$parent.steps.push(this);
  },
  beforeDestroy () {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1)
    }
  }
}
</script>
