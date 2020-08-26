<template>
  <div class="je-collapse-item"
    :class="{
      'je-collapse-active': isActive,
      'je-collapse-disabled': disabled
    }">
    <div class="je-collapse-header" @click="toggle">
      <!-- <i class="icon at-collapse__icon icon-chevron-right"></i> -->
      <slot name="title" v-if="$slots.title"></slot>
      <div v-else>{{ title }}</div>
    </div>
    <foldAnimate>
      <div class="je-collapse-body" v-show="isActive">
        <div class="je-collapse-content">
          <slot></slot>
        </div>
      </div>
    </foldAnimate>
  </div>
</template>

<script>
import foldAnimate from '../../utils/foldAnimate';
export default {
  name: 'jeCollapseItem',
  components: {
    foldAnimate
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      index: 0,
      isActive: false
    }
  },
  methods: {
    toggle () {
      if (this.disabled) return false
      this.$parent.toggle({
        name: this.name || this.index,
        isActive: this.isActive
      })
    }
  }
}
</script>
