<template>
  <div class="tree-item" :class="{ active: data.show, selected: data.label === selected }">
    <div class="tree-title" :style="itemStyle" @click.stop="toggleTree(data)">
      <jeIcon :type="itemIcon(data)" custom="je-c9"></jeIcon>
      <jeCheckbox class="je-ml5"
        v-if="showCheckbox"
        v-model="data.checked"
        :disabled="data.disabled"
        :indeterminate="data.someSelect&&!data.checked"
        @click.native.stop
        @change="checkboxChanges(data, $event)"
      ></jeCheckbox>
      <span class="je-f15">
        {{ data.label }}
        <span v-if="showValue">({{ data.value }})</span>
      </span>
    </div>
    <FoldAnimate>
      <div class="tree-children" v-show="data.show" v-if="data[childs]">
        <p class="tree-loading" v-if="data[childs].length === 0 && $parent.lazy"></p>
        <jeTreeItem
          v-for="(item, index) in data[childs]" :data="item" :key="index"
          :fields="fields" :showCheckbox="showCheckbox" :showValue="showValue"
          :isChildren="item[childs] && item[childs].length > 0" :expandAll="expandAll"
          @click="clickTree" @toggle="toggleTreeChild"
          @checkboxChange="checkboxChangeChild"
        ></jeTreeItem>
      </div>
    </FoldAnimate>
  </div>
</template>
<script>
import { jeCheckbox } from "../checkbox";
import { jeIcon } from "../icon";
import FoldAnimate from "../../utils/foldAnimate";
export default {
  name: "jeTreeItem",
  data() {
    return {
      childs: "",
      ParentLayerNum: 0,
      selected: "" // 当前点击项的值
    };
  },
  props: ["data", "showValue", "showCheckbox", "isChildren", "fields","expandAll"],
  components: {
    jeIcon,
    jeCheckbox,
    FoldAnimate
  },
  created() {
    this.childs = this.fields.children;
    if(this.expandAll && this.data[this.childs] && this.data[this.childs].length > 0){     
      this.$set(this.data, "show", true);
    }
  },
  mounted() {
    this.findParentComponents(this);
  },
  methods: {
    itemIcon(data) {
      let reCls = "icon-doc";
      if (data[this.childs]) {
        reCls = "icon-caret-right";
      }
      if (data.show) {
        reCls = "icon-caret-down";
      }
      return reCls;
    },
    findParentComponents(val) {
      let parent = val.$parent,
        opts = parent.$options;
      if (parent && opts.name === "jeTreeItem") {
        this.ParentLayerNum = this.ParentLayerNum + 1;
        this.findParentComponents(parent);
      }
    },
    clickTree(item) {
      this.selected = item.name;
      this.$emit("click", item);
    },
    toggleTree(data) {
      if (data[this.childs]) {
        if (typeof data.show === "undefined") {
          this.$set(data, "show", true);
        } else {
          this.$set(this.data, "show", !data.show);
          // data.show = !data.show;
        }
        this.clickTree(data);
        this.$emit("toggle", data);
      }
    },
    toggleTreeChild(item) {
      this.$emit("toggle", item);
    },
    checkboxChangeChild(data) {
      this.$emit("checkboxChange", data); // 父级处理
    },
    checkboxChanges(data, isCheck) {
      // 将所有子级勾选或取消
      this.checkedChilds(data, isCheck);
      this.checkboxChangeChild(data); // 父级处理
    },
    checkedChilds(data, isCheck) {
      if (data[this.childs]) {
        data[this.childs].forEach(item => {
          if (!item.disabled) {
            // 跳过禁用项
            if (typeof item.checked === "undefined") {
              this.$set(item, "checked", isCheck);
            } else {
              item.checked = isCheck;
            }
            if (item[this.childs]) {
              this.checkedChilds(item, isCheck);
            }
          }
        });
      }
    }
  },
  computed: {
    itemStyle() {
      let parentName = this.$parent.$options.name === "jeTreeItem";
      return {
        paddingLeft: parentName ? `${this.ParentLayerNum * 18}px` : ""
      };
    }
  }
};
</script>
