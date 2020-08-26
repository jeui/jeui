<template>
  <div class="je-input" :style="{width:width}">
    <section :class="wrapClass">
      <header v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </header>
      <main
        v-if="type !== 'textarea'"
        :class="{hover:isHover,normal:!isHover,bordered:bordered}"
        @mouseenter.stop="hovering = true"
        @mouseleave.stop="hovering = false"
      >
        <slot name="prefix">
          <Icon v-if="prefix&&prefix!=''" :type="prefix" class="je-pl4 je-c9" />
        </slot>
        <input
          :class="sizeClass"
          :style="inputStyle"
          v-bind="$attrs"
          :type="type"
          :name="name"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          :value="currValue"
          @keyup="handleKeyup"
          @keypress="handleKeypress"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @change="handleChange"
        />
        <Icon
          type="icon-close"
          v-if="showClear"
          @click="handleClear"
          class="je-pr4 je-c9 input-close"
          style="cursor: pointer;"
        />
        <span v-else>
          <slot name="suffix">
            <Icon v-if="suffix&&suffix!=''" :type="suffix" class="je-pr4 je-c9" />
          </slot>
        </span>
        <em
          v-if="isWordLimitVisible"
          class="je-input-wordlimit je-pr8"
        >{{ textLength }}/{{ upperLimit }}</em>
      </main>
      <main v-else :class="{hover:isHover,normal:!isHover,bordered:bordered}">
        <textarea
          class="je-textarea"
          v-bind="$attrs"
          :name="name"
          :placeholder="placeholder"
          :rows="rows"
          :readonly="readonly"
          :disabled="disabled"
          :value="currValue"
          @keyup="handleKeyup"
          @keypress="handleKeypress"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @change="handleChange"
        ></textarea>
        <em
          v-if="isWordLimitVisible && type === 'textarea'"
          class="je-textarea-wordlimit"
        >{{ textLength }}/{{ upperLimit }}</em>
      </main>
      <footer v-if="$slots.append">
        <slot name="append"></slot>
      </footer>
    </section>
  </div>
</template>

<script>
import Emitter from "../../utils/emitter";
import Icon from "../icon/Icon";
export default {
  name: "jeInput",
  mixins: [Emitter],
  components: {
    Icon,
  },
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    width: {
      type: String,
      default: "200px",
    },
    type: {
      type: String,
      default: "text",
    },
    size: {
      type: [String, Object],
      default: "small",
    },
    prefix: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
    textAlign: {
      type: String,
      default: "left",
    },
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    rows: {
      type: Number,
      default: 2,
    },
    name: {
      type: String,
      default: "",
    },
    number: {
      type: Boolean,
      default: false,
    },
    wordLimit: {
      type: Boolean,
      default: false,
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isHover: false,
      // isFocus: false,
      currValue: this.value,
      // visible: true,
      isSizeObject: false,
      hovering: false,
    };
  },
  watch: {
    value(value) {
      this.currValue = this.number ? value.replace(/[^\d.]/g, "") : value;
    },
  },
  created() {
    this.isSizeObject =
      Object.prototype.toString.call(this.size) == "[object Object]";
  },
  methods: {
    handleKeydown(event) {
      this.$emit("on-keydown", event);
    },
    handleKeypress(event) {
      this.$emit("on-keypress", event);
    },
    handleKeyup(event) {
      this.$emit("on-keyup", event);
    },
    handleFocus(event) {
      this.isHover = true;
      this.$emit("on-focus", event);
    },
    handleBlur(event) {
      this.isHover = false;
      this.$emit("on-blur", event);
      if (this.validateEvent) {
        this.dispatch("jeFormItem", "form-blur", [this.value]);
      }
    },
    handleInput(event) {
      this.currValue = event.target.value;
      // this.visible = this.currValue !== '' ? true : false;
      this.$emit("input", this.currValue);
      this.currValue = Number.isNaN(Number(this.currValue))
        ? this.currValue
        : Number(this.currValue);
    },
    handleChange(event) {
      this.$emit("change", event);
    },
    handleClear() {
      const e = { target: { value: "" } };
      this.currValue = "";
      this.$emit("input", "");
      this.$emit("change", e);
      this.$emit("clear");
    },
  },
  computed: {
    wrapClass() {
      return [
        "je-input-wrap",
        {
          ["je-input-prepend"]: this.$slots.prepend,
          ["je-input-append"]: this.$slots.append,
        },
      ];
    },
    sizeClass() {
      return ["je-input", !this.isSizeObject ? `je-${this.size}` : ""];
    },
    inputStyle() {
      let size =
        this.isSizeObject && Object.keys(this.size).length > 0 ? this.size : {};
      return Object.assign({ textAlign: this.textAlign }, size);
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.currValue === "number") {
        return String(this.currValue).length;
      }
      return (this.currValue || "").length;
    },
    isWordLimitVisible() {
      return (
        this.wordLimit &&
        this.$attrs.maxlength &&
        (this.type === "text" || this.type === "textarea") &&
        !this.disabled &&
        !this.readonly &&
        this.type !== "password"
      );
    },
    showClear() {
      return (
        this.clearable &&
        this.currValue != "" &&
        !this.disabled &&
        !this.readonly &&
        this.hovering
      );
    },
  },
};
</script>
