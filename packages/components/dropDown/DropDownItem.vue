<template>
  <dd :class="{ disabled: isDisabled }" @click.stop="menuItemSelect" @mousedown.prevent>
    <Icon v-if="icon != ''" :type="icon" class="je-pr4"/>
    <slot></slot>
  </dd>
</template>

<script>
import Emitter from "../../utils/emitter";
import Icon from '../icon/Icon'
export default {
  name: "jeDropDownItem",
  mixins: [Emitter],
  components: {
    Icon
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    },
    command: {
      type: [String,Number,Object],
      default() { return {} }
    }
  },
  data() {
    return {
      isDisabled: this.disabled
    };
  },
  methods: {
    menuItemSelect() {
      this.isDisabled = this.disabled ? true : false
      if(!this.isDisabled){        
        this.dispatch(
          "jeDropDownMenu",
          "menu-item-click",
          [this.command, this]
        );
        this.$emit('change',this)
      }
    }
  }
};
</script>
