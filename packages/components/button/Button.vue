<template>
  <button
    type="button"
    :class="btnClass"
    :autofocus="autofocus"
    @click="handleClick"
    :style="{borderRadius:roundValue}"
    :disabled="disabled"
  >
    <Icon v-if="icon!=''" :type="icon"></Icon>
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script>
import Icon from "../icon/Icon";
export default {
  name: "jeButton",
  props: {
    type: {
      type: String,
      default: "default",
    },
    size: {
      type: String,
      default: "small",
    },
    icon: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    round: {
      type: String,
      default: "4px",
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      roundValue: this.round,
    };
  },
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    },
  },
  computed: {
    btnClass() {
      let that = this;
      let fullObjs = {
        [`je-bg-${that.type}`]: that.type != "",
        [`je-border-${that.type}`]: that.type != "",
        ["je-cf"]: that.plain == false && that.type != "default",
      };
      let plainObjs = {
        [`je-light-bg-${that.type}`]: that.type != "",
        [`je-light-border-${that.type}`]: that.type != "",
        [`je-${that.type}`]: that.plain == true,
      };
      return ["je-btn", `je-${that.size}`, that.plain ? plainObjs : fullObjs];
    },
  },
};
</script>
