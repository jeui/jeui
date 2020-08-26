<template>
  <div class="je-rate">
    <ul :class="rateList" @mouseover="overHandle" @mouseleave="leaveHandle">
      <li class="je-rate-item" :class="clacClass(index)" v-for="index in count" :key="index">
        <span :class="rateIcon" @mousemove="moveHandle(index, $event)" @click="confirmValue(index)">
          <Icon :type="icon" custom="je-rate-left" size="20px" rate="half"/>
        </span>
      </li>
    </ul>
    <div class="je-rate-text" v-if="showText">
      <slot>{{ currValue }}</slot>
    </div>
  </div>
</template>

<script>
import Icon from '../icon/Icon'
export default {
  name: 'jeRate',
  components: {
    Icon
  },
  props: {
    value: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    count: {
      type: Number,
      default: 5,
      validator: val => val >= 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'icon-star-fill'
    }
  },
  data () {
    return {
      currValue: this.value,
      hoverIndex: -1,
      lastHoverIndex: -1,
      isHoverRate: false,
      isHalf: this.allowHalf
    }
  },
  watch: {
    value (val) {
      this.currValue = val
      this.$emit('on-change', val)
    },
    currValue (val) {
      this.checkIsHalf(val)
    }
  },
  methods: {
    overHandle () {
      if (this.disabled) return
      this.isHoverRate = true
    },
    leaveHandle () {
      if (this.disabled) return
      this.isHoverRate = false
      this.hoverIndex = -1
      this.lastHoverIndex = -1
      this.checkIsHalf(this.currValue)
    },
    moveHandle (index, event) {
      if (this.disabled) return
      this.hoverIndex = index
      if (this.allowHalf 
      // && event.target.getAttribute('rate') === 'half'
      ) {
        this.isHalf = true
      } else {
        this.isHalf = false
      }

      const hoverIndex = this.isHalf ? index - 0.5 : index
      if (hoverIndex !== this.lastHoverIndex) {
        this.$emit('on-hover-change', hoverIndex)
      }
      this.lastHoverIndex = hoverIndex
    },
    confirmValue (index) {
      if (this.disabled) return
      this.currValue = this.isHalf ? index - 0.5 : index
      this.$emit('on-change', this.currValue)
      this.$emit('input', this.currValue)
    },
    clacClass (index) {
      const isHalf = this.isHalf
      const isHoverStar = this.hoverIndex !== -1
      const currIndex = isHoverStar ? this.hoverIndex : this.currValue
      const lastItemIndex = Math.ceil(currIndex)
      return {
        ['je-rate-item-on']: isHalf ? index < lastItemIndex : index <= lastItemIndex,
        ['je-rate-item-half']: (index === lastItemIndex) && isHalf,
        ['je-rate-item-off']: index > lastItemIndex
      }
    },
    checkIsHalf (val) {
      this.isHalf = this.allowHalf && val.toString().indexOf('.') >= 0
    }
  },
  computed: {
    rateList(){
      return [
        'je-rate-list',
        {
          ['je-rate-disabled']: this.disabled
        }
      ]
    },
    rateIcon(){
      return [
        'je-icon', 'je-rate-icon', this.icon
      ]
    }
  }
}
</script>
