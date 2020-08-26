<template>
  <div :class="avatarClass" :style="styles">
    <img :src="src" v-if="src" @error="handleError" :style="{ 'object-fit': fit }">
    <Icon :type="icon" :size="avatarSize/2" v-else-if="icon"></Icon>
    <span class="je-avatar-text" v-else><slot></slot></span>
  </div>
</template>

<script>
import Icon from '../icon/Icon'
export default {
  name:"jeAvatar",
  props: {
    shape: {
      type: String,
      default: 'circle',
      validator(val) {
        return ['circle', 'square'].includes(val);
      }
    },
    size: {
      type: [String,Number],
      default: '40'
    },
    src: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    fit: {
      type: String,
      default: 'cover',
      validator(val) {
        return ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(val);
      }
    }
  },
  data() {
    return {
      avatarSize: this.size
    }
  },
  components:{
    Icon
  },
  created() {
    if(Object.prototype.toString.call(this.size)=="[object String]"){
      this.avatarSize = parseInt(this.size)
    }
  },
  methods: {
    handleError (e) {
      this.$emit('on-error', e);
    }
  },
  computed: {
    avatarClass(){
      return [
        'je-avatar',
        `je-avatar-${this.shape}`
      ]
    },
    styles () {
      let style = {};
      if (this.avatarSize && this.avatarSize !== 0) {
        style.width = `${this.avatarSize}px`;
        style.height = `${this.avatarSize}px`;
        style.lineHeight = `${this.avatarSize}px`;
        // style.fontSize = `${this.avatarSize/2}px`;
      }
      return style;
    }
  }
}
</script>

