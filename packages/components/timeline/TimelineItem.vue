<template>
  <div class="je-timeline-item" :class="{'timeline-dotted':isPendingItem}">
    <div class="je-timeline-dotwrap" v-if="$slots.dot">
      <slot name="dot"></slot>
    </div>
    <div class="je-timeline-dotwrap" v-if="!$slots.dot">
      <div class="timestamp-custom" v-if="icon!=''" :style="dotStyle">
        <Icon :type="icon" size="16" />
      </div>
      <span class="timestamp-normal" v-if="!icon" :style="dotStyle"></span>
    </div>
    <div class="je-timeline-wrapper">
      <div class="je-timeline-timestamp timestamp-top" v-if="!hideTimestamp && placement === 'top'">
        {{timestamp}}
      </div>
      <div class="je-timeline-content"><slot></slot></div>
      <div class="je-timeline-timestamp timestamp-bottom" v-if="!hideTimestamp && placement === 'bottom'">
        {{timestamp}}
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../icon/Icon'
export default {
  name: "jeTimelineItem",
  components: {
    Icon
  },
  props: {
    timestamp: {
      type: String,
      default: ''
    },
    hideTimestamp: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    color: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPendingItem: false,
    }
  },
  mounted() {
    this.checkForLast()
  },
  methods: {
    checkForLast () {
      const children = this.$parent.$children
      const isPending = this.$parent.pending
      const index = children.indexOf(this)
      if (isPending) {
        this.isPendingItem = (index === (children.length - 2))
      }
    }
  },
  computed: {
    dotStyle(){
      return this.icon!='' ? {color: this.color} : {backgroundColor: this.color}
    }
  },
}
</script>