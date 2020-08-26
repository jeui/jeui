<template>
  <div class="je-tabs-pane" v-show="paneShow">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'jeTabsPane',
  props: {
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currName: this.name,
      show: true
    }
  },
  watch: {
    name () {
      this.currName = this.name
    }
  },
  mounted () {
    this.$parent.updateNav()
  },
  computed: {
    paneShow(){
      return this.$parent.hidePane ? false : this.show
    },
    isClosable () {
      return this.closable ? this.$parent.closable : false
    }
  }
}
</script>