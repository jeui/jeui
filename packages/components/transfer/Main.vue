<!--
 * @Description: 穿梭框主体
--> 
<template>
  <div class="je-transfer">
    <transfer-panel
      v-bind="$props"
      :title="titleList[0] || '列表1'"
      :data="source"
      :default-check="sourceDefaultChecked"
      :placeholder="placeholder || '请输入搜索内容'"
      @checkChange="onSourceChange"
      :style="{height: height}"
    ></transfer-panel>
    <div class="je-transfer-button">
      <je-button :disabled="checkTargetList.length === 0" @click.native="addToSource" plain>
        <Icon type="icon-line-left" size="12px"></Icon>
        <span v-if="buttonList[0] !== undefined" class="button-text">{{ buttonList[0] }}</span>
      </je-button>
      <je-button
        class="je-ml10"
        :disabled="checkSourceList.length === 0"
        @click.native="addToTarget"
        plain
      >
        <span v-if="buttonList[1] !== undefined" class="button-text">{{ buttonList[1] }}</span>
        <Icon type="icon-line-right" size="12px"></Icon>
      </je-button>
    </div>
    <transfer-panel
      v-bind="$props"
      :title="titleList[1] || '列表2'"
      :data="target"
      :default-check="targetDefaultChecked"
      :placeholder="placeholder || '请输入搜索内容'"
      @checkChange="onTargetChange"
      :style="{height: height}"
    ></transfer-panel>
  </div>
</template>

<script>
import TransferPanel from "./Transfer-panel";
import JeButton from "../button/Button";
import Icon from "../icon/Icon";

export default {
  components: {
    TransferPanel,
    JeButton,
    Icon,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    fields: {
      type: Object,
      default() {
        return {
          label: "label",
          key: "key",
          disabled: "disabled",
        };
      },
    },
    buttonList: {
      type: Array,
      default() {
        return [];
      },
    },
    titleList: {
      type: Array,
      default() {
        return [];
      },
    },
    sourceDefaultChecked: {
      type: Array,
      default() {
        return [];
      },
    },
    targetDefaultChecked: {
      type: Array,
      default() {
        return [];
      },
    },
    placeholder: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "300px",
    },
    isFilter: Boolean,
    filterMethod: Function,
  },
  data() {
    return {
      checkSourceList: [],
      checkTargetList: [],
    };
  },
  computed: {
    source() {
      return this.data.filter(
        (item) => this.value.indexOf(item[this.fields.key]) === -1
      );
    },
    target() {
      // if (this.targetOrder === 'original') {
      return this.data.filter(
        (item) => this.value.indexOf(item[this.fields.key]) > -1
      );
      // } else {
      //   return this.value.reduce((arr, cur) => {
      //     const val = this.dataObj[cur];
      //     if (val) {
      //       arr.push(val);
      //     }
      //     return arr;
      //   }, []);
      // }
    },
  },
  methods: {
    onSourceChange(val, checkByUser) {
      this.checkSourceList = val;
      if (!checkByUser) return;
      this.$emit("source-check-change", val);
    },
    onTargetChange(val, checkByUser) {
      this.checkTargetList = val;
      if (!checkByUser) return;
      this.$emit("target-check-change", val);
    },
    addToSource() {
      let currentValue = this.value.slice();
      this.checkTargetList.forEach((item) => {
        const index = currentValue.indexOf(item);
        if (index > -1) {
          currentValue.splice(index, 1);
        }
      });
      this.$emit("input", currentValue);
      this.$emit("change", currentValue, "target", this.checkTargetList);
    },
    addToTarget() {
      let currentValue = this.value.slice();
      const items = [];
      const key = this.fields.key;
      this.data.forEach((item) => {
        let value = item[key];
        if (
          this.checkSourceList.indexOf(value) > -1 &&
          this.value.indexOf(value) === -1
        ) {
          items.push(value);
        }
      });
      currentValue = currentValue.concat(items);
      this.$emit("input", currentValue);
      this.$emit("change", currentValue, "source", this.checkSourceList);
    },
  },
};
</script>
