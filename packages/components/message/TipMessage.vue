<template>
  <transition name="scale" @after-leave="doDestory">
    <div class="je-centermsg" :style="{zIndex: zIndex,top: top, left: left}" ref="centermsg" v-show="showCenterMsg">
      <Icon :type="icon" :size="18" v-if="icon !== ''"></Icon>
      <span class="content">{{ message }}</span>
    </div>
  </transition>
</template>

<script>
let msgzIndex = 10086;
import Icon from '../icon/Icon.vue'
export default {
  name: "jeCenterMessage",
  props: {
    visible:{
      type: Boolean,
      default: false
    },
    message:{
      type: String,
      default: ""
    },
    icon:{
      type: String,
      default: ""
    },
    duration:{
      type: Number,
      default: 4
    },
  },
  data () {
    return {
      showCenterMsg: false,
      zIndex: 0,
      top: 0,
      left: 0,
      timer: null,
      closed: false,
    }
  },
  components:{
    Icon
  },

  methods: {
    doDestory() {
      this.$destroy(true)
      this.$el.remove();
    },
    handleClose() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose()
      }
    },
    setSize(){
      this.top = (document.body.clientHeight - this.$el.clientHeight)/2 + 'px';
      this.left = (document.body.clientWidth - this.$el.clientWidth)/2 + 'px';
    },
    startTimer() {
      let that = this;
      that.zIndex = msgzIndex++;
      that.setSize();
      if (that.duration) {
        that.timer = setTimeout(() => {
          that.showCenterMsg = false;
          that.handleClose();
        }, that.duration * 1000);
      }
    },
    clearTimer() {
      this.timer && clearTimeout(this.timer);
    }
  },
  mounted() {
    document.body.appendChild(this.$el);
    this.showCenterMsg = this.visible;
    this.$nextTick(() => {
      
      this.startTimer();
    })
    
  }
}
</script>
