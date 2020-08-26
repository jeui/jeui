<template>
  <div
    class="je-inputNumber"
    :class="wrapClass"
    :style="{width:width}"
    @mouseenter="handleHover('enter')"
    @mouseleave="handleHover('leave')"
  >
    <div class="je-inputNumber-box">
      <button
        v-if="controls"
        @mousedown="handleDown($event)"
        @mouseup="clearTapTimer"
        :disabled="currValue <= min || disabled"
      >
        <Icon type="icon-normal-minus" size="18px" />
      </button>
      <input
        class="je-input"
        :disabled="disabled"
        :autofocus="autofocus"
        autocomplete="off"
        spellcheck="false"
        @focus="focus"
        @blur="blur"
        @change="handleChange"
        @keydown.stop="keyDown($event)"
        :readonly="readonly || !editable"
        type="number"
        :name="name"
        :value="currValue"
        :placeholder="placeholder"
      />
      <button
        v-if="controls"
        @mousedown="handleUp($event)"
        @mouseup="clearTapTimer"
        :disabled="currValue >= max || disabled"
      >
        <Icon type="icon-normal-add" size="18px" />
      </button>
      <div class="wrap" v-if="!controls">
        <button
          @mousedown.stop="handleUp($event)"
          @mouseup="clearTapTimer"
          :disabled="currValue >= max || disabled"
        >
          <Icon type="icon-moveup" size="12px" />
        </button>
        <button
          @mousedown.stop="handleDown($event)"
          @mouseup="clearTapTimer"
          :disabled="currValue <= min || disabled"
        >
          <Icon type="icon-movedown" size="12px" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Emitter from "../../utils/emitter";
import Icon from "../icon/Icon";
export default {
  name: "jeInputNumber",
  mixins: [Emitter],
  props: {
    value: {
      type: Number,
      default: 1,
    },
    width: {
      type: String,
      default: "120px",
    },
    size: {
      type: String,
      default: "small",
    },
    controls: {
      type: Boolean,
      default: true,
    },
    max: {
      type: [Number, String],
      default: Infinity,
    },
    min: {
      type: [Number, String],
      default: 1,
    },
    step: {
      type: Number,
      default: 1,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
    },
    placeholder: {
      type: String,
      default: "",
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      currValue: this.value,
      isHover: false,
      tapParams: {
        timer: null,
        tapStartTime: 0,
      },
      longpress: true,
    };
  },
  watch: {
    //监听子组件currentValue是否改变
    currValue(val) {
      val = val.replace(/[^\d.]/g, "");
      //$emit与父组件通信  （子组件-->父组件）
      //this指向当前组件实例
      this.$emit("input", val);
      //定义自定义函数进行通信
      this.$emit("inputChange", val);
      if (this.validateEvent) {
        this.dispatch("jeFormItem", "form-blur", [this.value]);
      }
    },
    //监听父组件value是否改变
    value(val) {
      this.updateValue(val);
    },
  },
  methods: {
    handleHover(type) {
      this.isHover = type == "enter" ? true : false;
    },
    preventDefault(e) {
      e.preventDefault();
    },
    focus(event) {
      this.focused = true;
      this.$emit("on-focus", event);
    },
    blur(event) {
      this.focused = false;
      if (this.currValue == "") {
        this.currValue = this.min;
      }
      this.$emit("on-blur", event);
      if (this.validateEvent) {
        this.dispatch("jeFormItem", "form-blur", [this.value]);
      }
    },
    keyDown(e) {
      this.clearTimer();
      if (this.readonly) return;
      if (e.keyCode === 38) {
        this.setUp();
      } else if (e.keyCode === 40) {
        this.setDown();
      }
    },
    setUp() {
      this.currValue += this.step;
      if (this.currValue >= this.max) {
        this.currValue = this.max;
      }
    },
    setDown() {
      this.currValue -= this.step;
      if (this.currValue <= this.min) {
        this.currValue = this.min;
      }
    },
    handleDown(e) {
      this.clearTimer();
      if (this.longpress) {
        this.tapParams.tapStartTime = new Date().getTime() / 1000;
      }
      this.calculation("minus");
    },
    handleUp(e) {
      this.clearTimer();
      if (this.longpress) {
        this.tapParams.tapStartTime = new Date().getTime() / 1000;
      }
      this.calculation("add");
    },
    //父组件传递过来的值可能不符合条件（大于最大值，小于最小值）
    updateValue(val) {
      if (val > this.max) {
        val = this.max;
      }
      if (val < this.min) {
        val = this.min;
      }
      this.currValue = val;
    },
    handleChange(event) {
      let val = event.target.value.trim(),
        max = this.max,
        min = this.min;
      if (this.isValueNumber(val)) {
        val = Number(val);
        this.currValue = val;
        if (val > max) {
          this.currValue = max;
        }
        if (val < min) {
          this.currValue = min;
        }
      } else {
        //如果输入的不是数字，将输入的内容重置为之前的currValue
        // event.target.value = this.currValue;
        this.currValue = min;
      }
    },
    clearTimer() {
      if (this.currValue == this.min || this.currValue == this.max) {
        clearTimeout(this.tapParams.timer);
      }
    },
    clearTapTimer() {
      if (this.longpress) {
        clearTimeout(this.tapParams.timer);
      }
    },
    calculation(type) {
      if (type == "add") {
        this.setUp();
      } else if (type == "minus") {
        this.setDown();
      }
      if (this.longpress) {
        this.longpressHandler(type);
      }
    },
    longpressHandler(type) {
      const currentDate = new Date().getTime() / 1000;
      let intervalTime = currentDate - this.tapParams.tapStartTime;
      if (intervalTime < 1) intervalTime = 0.5;
      let secondCount = intervalTime * 10;
      if (intervalTime === 30) secondCount = 50;
      if (intervalTime >= 40) secondCount = 100;

      this.tapParams.timer = setTimeout(() => {
        this.calculation(type);
      }, 1000 / secondCount);
    },
    //验证输入值是否为数字
    isValueNumber(value) {
      return /(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]*$)|(^-?0{1}$)/.test(value + "");
    },
  },
  mounted() {},
  computed: {
    wrapClass() {
      return [
        `je-${this.size}`,
        {
          without: this.controls,
          group: !this.controls,
          hover: this.isHover,
        },
      ];
    },
  },
};
</script>

