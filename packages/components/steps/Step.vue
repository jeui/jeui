<template>
  <div :class="stepClass">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'jeStep',
    props: {
      current: {
        type: Number,
        default: 0,
        validator(val){
          return val >= 0
        }
      },
      status: {
        type: String,
        default: 'process',
        validator(val){
          return ['wait', 'process', 'finish', 'error'].indexOf(val) > -1
        }
      },
      size: {
        type: String,
        default: 'default',
        validator(val){
          return ['default', 'small'].indexOf(val) > -1
        }
      },
      direction: {
        type: String,
        default: 'horizontal',
        validator(val){
          return ['horizontal', 'vertical'].indexOf(val) > -1
        }
      }
    },
    data() {
      return {
        steps: []
      }
    },
    watch: {
      current() {
        this.updateStatus()
      },
      steps(vals) {
        vals.forEach((step, index) => {
          step.stepIndex = index;
        })
        this.updateStatus()
      }
    },
    mounted() {
      this.updateStatus()
    },
    methods: {
      updateStatus() {
        let that = this, current = that.current, status = that.status;
        that.steps.forEach((child, index) => {
          const prevChild = that.steps[index - 1]
          if (index === current) {
            if (status === 'error') {
              child.internalStatus = 'error'
              prevChild && (prevChild.nextError = true)
            } else {
              child.internalStatus = 'process'
            }
          } else if (index < current) {
            child.internalStatus = 'finish'
          } else {
            child.internalStatus = 'wait'
          }
          if (child.finalStatus !== 'error' && prevChild) {
            prevChild.nextError = false
          }
        })
      }
    },
    computed: {
      stepClass(){
        let that = this;
        return [
          'je-step', 
          that.direction === 'vertical' ? 'je-step-vertical' : 'je-step-horizontal',
          that.size === 'small' ? 'je-step-small' : ''
        ]
      }
    },
  }

</script>

