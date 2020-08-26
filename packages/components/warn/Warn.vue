<template>
  <transition name="fade">
    <div v-if="visible" :class="warnClass">
      <span :class="iconClass" v-if="$slots.icon && iconType!=''">
        <slot name="icon">
          <Icon :type="iconType"></Icon>
        </slot>
      </span>
      <div class="je-flex je-vertical">
        <h3 :class="warnMsgClass">
          <slot></slot>
        </h3>
        <p class="je-warn-desc" v-if="$slots.desc">
          <slot name="desc"></slot>
        </p>
      </div>
      <a :class="closeClasses" v-if="closable && $slots.icon" @click="closeWarn">
        <slot name="close">
          <Icon type="ios-close"></Icon>
        </slot>
      </a>
    </div>
  </transition>
</template>

<script>
export default {
  name: "jeWarn",
  props: {
    type: {
      type: String,
      default: 'default'
    },
    effect: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: ''
    },
    
    closable: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      visible: true,
      iconType: this.icon
    }
  },
  computed: {
    warnClass(){
      let that = this, effect = that.effect ? 'light' : '';
      let objs = that.type == 'default' ? {
          ['je-border-cc']: true,
          [`je-bg-${that.type}`]: that.type != '',
          ['je-c3']: true,
        } : {
          [`je-bg-${that.type}`]: that.type != '',
          [`je-border-${that.type}`]: that.type != '',
          [ `je-${that.type}`]: that.type != '',
          [ that.effect ? `je-${that.type}` : 'je-white']: true,
        };
      return [
        'je-warn','je-flex',
        objs,`${effect}`,
      ]
    },
    iconClass(){
      let objs = that.type == 'default' ? {
        ['je-c3']: true,
      } : {
        [ that.effect ? `je-${that.type}` : 'je-white']: true,
      }
      return [ objs ]
    },
    warnMsgClass(){
      return [
        'je-warn-msg',
        this.$slots.desc !== undefined ? 'warn-bold' : ''
      ]
    }
  },
  methods: {
    closeWarn(event) {
      this.visible = false;
      this.$emit('close', e);
    }
  },
}
</script>

