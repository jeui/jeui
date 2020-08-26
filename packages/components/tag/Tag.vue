<template>
  <transition name="fade">
    <div :class="colorClass" :style="colorStyle">
      <div class="je-tag-box">
        <span class="je-tag-text"><slot></slot></span>
        <Icon type="icon-normal-close" custom="je-ml8" size="12px" v-if="closable" @click="closeAction"/>
      </div>
    </div>
  </transition>
</template>

<script>
import Icon from '../icon/Icon'
export default {
  name:"jeTag",
  props: {
    name: {
      type: [String, Number]
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'default'
    },
    plain: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Icon
  },
  computed: {
    colorClass () {
      let that = this;
      let fullObjs = {
          [`je-bg-${that.type}`]: that.type != '',
          [`je-border-${that.type}`]: that.type != '',
          ['je-cf']: that.plain == false && that.type != 'default'
        }
        let plainObjs = {
          [`je-light-bg-${that.type}`]: that.type != '',
          [`je-light-border-${that.type}`]: that.type != '',
          [`je-${that.type}`]: that.plain == true
        }
      return [
        'je-tag',
        `je-${that.size}`,
        that.plain ? 'je-tag-plain':'',
        that.plain ? plainObjs : fullObjs
      ]
    },
    colorStyle () {
      return {
        borderColor: this.color,
        backgroundColor: this.color
      }
    },
    
  },
  methods: {
    closeAction(event){
      if (typeof this.name === 'undefined') {
        this.$emit('close', event)
      } else {
        this.$emit('close', event, this.name)
      }
    }
  },
}
</script>

