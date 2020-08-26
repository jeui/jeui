<template>
  <div class="je-message" :style="msgStyle">
    <transition name="move-up" @after-leave="doDestory">
      <div class="je-message-content" :class="contentClass" v-show="showMessage">
        <Icon :type="iconClass" :size="18"></Icon>
        <span class="content">{{ message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
let msgzIndex = 10086;
import Icon from '../icon/Icon.vue'
export default {
  name: "jeMessage",
  props:{
    visible:{
      type: Boolean,
      default: false
    },
    type:{
      type: String,
      default: ''
    },
    message:{
      type: String,
      default: ''
    },
    duration:{
      type: Number,
      default: 4
    },
    icon:{
      type: String,
      default: ''
    },
    onClose: Function,
  },
  data() {
    return {
      showMessage: false,
      zIndex: 0,
      timer: null,
      closed: false,
      top: null
    }
  },
  components:{
    Icon
  },
  computed: {
    iconClass() {
      const classArr = {
        success: 'je-icon-success',
        error: 'je-icon-error',
        warning: 'je-icon-warning',
        info: 'je-icon-info',
        loading: 'je-icon-loading2'
      }
      return this.icon !== '' ? this.icon : classArr[this.type];
    },
    msgStyle(){
      return {
        top: this.top ? `${this.top}px` : 'auto',
        zIndex: this.zIndex
      }
    },
    contentClass(){
      let that = this, types = that.type === 'error' ? 'danger' : that.type
      return [
        {
          [`je-light-bg-${types}`]: that.type != '',
          [`je-light-border-${types}`]: that.type != '',
          [`je-${types}`]: that.type != '',
        }
      ]
    }
  },
  watch: {
    closed(val) {
      if (val) {
        this.showMessage = false
      }
    }
  },
  mounted() {
    document.body.appendChild(this.$el);
    this.startTimer();
  },
  methods: {
    doDestory() {
      this.$destroy(true);
      this.$el.remove();
    },
    close() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },
    startTimer() {
      this.zIndex = msgzIndex++;
      this.showMessage = this.visible;
      if (this.duration) {
        this.timer = setTimeout(() => {
          !this.closed && this.close()
        }, this.duration * 1000);
      }
    },
    clearTimer() {
      this.timer && clearTimeout(this.timer);
    }
  }
}

</script>

