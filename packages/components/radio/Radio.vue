<template>
  <label :class="[radioClass,{'je-radio-checked': currValue === label}]">
    <input
      hidden
      type="radio"
      class="je-radio-input"
      v-model="currValue"
      :name="groupName"
      :value="label"
      :disabled="disabled"
      @change="change"
      @focus="focus = true"
      @blur="focus = false"
    />
    <span class="je-radio-wrap" v-if="!isButton">
      <span class="je-radio-inner"></span>
    </span>
    <span class="je-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import { findComponentUpward } from "../../utils/findComponent";
import Emitter from "../../utils/emitter";
export default {
  name: "jeRadio",
  mixins: [Emitter],
  props: {
    value: [String, Number, Boolean],
    name: [String, Number],
    label: {
      type: [String, Number, Boolean],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String, Number],
      default: "mini",
    },
  },
  data() {
    return {
      currValue: this.value,
      groupName: this.name,
      parent: findComponentUpward(this, "jeRadioGroup"),
      radioSize: this.size,
      focus: false,
      isGroup: false,
      isButton: false,
      isBorder: false,
    };
  },
  watch: {
    currValue(val) {
      this.$emit("input", val);
      if (this.isGroup) {
        this.dispatch("jeRadioGroup", "input", val);
      }
    },
    value(val) {
      this.currValue = val;
    },
  },
  created() {
    if (this.parent) {
      if (this.parent.type === "button") {
        this.isButton = true;
      }
      if (this.parent.type === "border") {
        this.isBorder = true;
      }
      if (this.parent.size !== "") {
        this.radioSize = this.parent.size;
      }
      this.groupName = this.parent.name;
    }
    this.$on("initRadio", (data) => {
      this.currValue = data;
      this.isGroup = true;
    });
  },
  methods: {
    change(event) {
      if (this.disabled) {
        return false;
      } else {
        this.$emit("change", this.currValue);
        this.dispatch("jeFormItem", "form-blur", [this.currValue]);
      }
    },
  },
  computed: {
    radioClass() {
      return [
        "je-radio",
        "je-align-center",
        "je-justify-left",
        {
          ["je-radio-button"]: this.isButton,
          ["je-radio-normal"]: !this.isButton,
          ["je-radio-border"]: this.isBorder,
          ["je-radio-disabled"]: this.disabled,
          [`je-${this.radioSize}`]: this.radioSize,
        },
      ];
    },
    radioInner() {
      return {
        "je-radio-checked": this.currValue === this.label,
        "je-radio-disabled": this.disabled,
      };
    },
  },
};
</script>


