<template>
  <div class="je-tree">
    <jeTreeItem
      v-for="(item,index) in data" :data="item" :key="index"
      :fields="fields" :showCheckbox="showCheckbox" :showValue="showValue"
      :isChildren="item[childs] && item[childs].length>0" :expandAll="expandAll"
      @click="clickTree" @toggle="toggleTree"
      @checkboxChange="checkChange"
    ></jeTreeItem>
  </div>
</template>
<script>
import jeTreeItem from "./TreeItem";

export default {
  name: "jeTree",
  components: { jeTreeItem },
  props: {
    data: Array,
    lazy: {
      type: Boolean,
      default: false
    },
    showValue: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    expandAll: {
      type: Boolean,
      default: false
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    props: {
      type: Object,
      default() { return {} }
    },
    setCheckedKeys: {
      type: Array,
      default() { return [] }
    },
    toggle: Function,
    click: Function,
    change: Function, // 多选框选择事件
    setKey: Function,
  },
  data() {
    return {
      childs: "",
      fields: {}
    }
  },
  created(){
    this.fields = Object.assign({
      label:'label',
      children:'children',
      disabled:'disabled'
    },this.props)
  },
  mounted() {
    this.childs = this.fields.children;
    if(this.setCheckedKeys.length > 0){
      this.setValue(this.setCheckedKeys)
    }
  },
  watch:{
  },
  methods: {
    clickTree(item) {
      this.$emit("click", item);
      this.click && this.click(item);
    },
    // 展开或收起
    toggleTree(item) {
      this.$emit("toggle", item);
      this.toggle && this.toggle(item);
    },
    // checkbox勾选事件，对父元素设置勾选或取消半选状态
    checkChange(data) {
      data.someSelect = false;
      const objs = this.findAllParents(this.data, data[this.nodeKey], []); // 查找所有父元素
      objs.forEach(item => {
        if (item[this.childs]) {
          // 没有时先添加属性
          if (typeof item.checked === "undefined") {
            this.$set(item, "checked", "");
          }
          let checkedAll = true; // 表示全选
          let checkedCancel = true; // 表示全不选
          item[this.childs].forEach(child => {
            if (!child.checked) {
              checkedAll = false;
            } else {
              checkedCancel = false;
            }
          });
          // 还原状态
          if (typeof item.someSelect === "undefined") {
            this.$set(item, "someSelect", false);
          } else {
            item.someSelect = false;
          }
          if (checkedAll) {
            // 表示所有子级已勾选
            item.checked = true;
            item.someSelect = false;
          } else if (checkedCancel) {
            // 表示全不选
            item.checked = false;
            item.someSelect = false;
          } else {
            // 选择部分
            item.checked = false;
            item.someSelect = true;
          }
        }
      });
      // 多选框改变事件
      let datas = {data,value:this.getValue()}
      this.$emit("change", datas);
      this.change && this.change(datas);
    },
    // 查找当前节点的父元素
    findParents(data, nodeId, allParent, parentNodes) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item[this.nodeKey] === nodeId) {
          if (parentNodes) {
            allParent.push(parentNodes);
          }
          break;
        } else {
          if (item[this.childs] && item[this.childs].length > 0) {
            this.findParents(item[this.childs], nodeId, allParent, item);
          }
        }
      }
    },
    // 查找当前节点的所有父元素
    findAllParents(data, nodeId, allParent = [], index = 0) {
      if (!nodeId) return;
      this.findParents(data, nodeId, allParent);
      if (allParent.length > 0) {
        const parentNode = allParent[index];
        if (parentNode) {
          this.findAllParents(data, parentNode[this.nodeKey], allParent, ++index);
        }
      }
      return allParent;
    },
    // 返回当前勾选key值
    getValue() {
      let checkedKey = [], checkedName = [];
      this.getValueFor(this.data, checkedKey, checkedName);
      return [checkedKey, checkedName];
    },
    // 递归找出所有已勾选的项
    getValueFor(data, key, name) {
      data.forEach(item => {
        if (item.checked) {
          key.push(item[this.nodeKey]);
          name.push(item[this.fields.label]);
        }
        if (item[this.childs] && item[this.childs].length > 0) {
          this.getValueFor(item[this.childs], key, name);
        }
      });
    },
    // 这里仅对指定项添加勾选状态，并不对子元素全选操作
    setValue(keys) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys');
      keys.forEach(item => {
        console.log(this.data)
        this.setValueEach(this.data, item);
      });
    },
    // 递归设置值
    setValueEach(data, key) {
      data.forEach(item => {
        if (item[this.nodeKey] == key) {
          if (item[this.fields.disabled]) return;
          this.$set(item, "checked", true);
          this.checkChange(item); // 处理父元素
          // return false;
        }
        if (item[this.childs] && item[this.childs].length > 0) {
          this.setValueEach(item[this.childs], key);
        }
      });
    }
  }
};
</script>
