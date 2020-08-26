<script>
import jeCheckbox from '../checkbox/Checkbox.vue';

export default {
  name: `jeTableColumn`,
  data() {
    return {
      renders: {},
    };
  },
  components: {
    jeCheckbox,
  },
  props: {
    prop: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    width: {
      type: [String, Number],
      default: "",
    },
    minWidth: {
      type: [String, Number],
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
    // 对齐方式，可选left/center/right
    align: {
      type: String,
      validator(value) {
        return ["left", "center", "right"].indexOf(value) !== -1;
      },
    },
    // 可选selection（多选）/index序号
    type: {
      type: String,
      validator(value) {
        return ["selection", "index", "extend"].indexOf(value) !== -1;
      },
    },
    // 固定当前列，可选left/right
    fixed: {
      type: String,
      validator(value) {
        return ["left", "right"].indexOf(value) !== -1;
      },
    },
    // 当前列显示排序按钮
    sortBy: {
      type: Boolean,
      default: false,
    },
    // 鼠标滑过单元格时是否显示title提示语
    title: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.renders = (h, { row, column, $index }) => {
      let children = null;
      if (this.$scopedSlots.default) {
        const data = {
          row: row,
          index: $index + 1,
        };
        if (column.$children.length == 0) {
          return this.$scopedSlots.default(data);
        }
      }
      if (column.type === "selection") {
        // 如果checkRows有当前行，则为选中状态
        let checkedStatus = this.$parent.checkRows.indexOf(row) !== -1;
        return h(
          "jeCheckbox",
          {
            props: {
              value: checkedStatus
            },
            on: {
              change: this.handleColChange.bind(this, row),
            },
          }
        );
      }
      if (column.type === "index") {
        // return h('div', style, $index + 1)
        return $index + 1;
      }
      return row[column.prop];
    };
  },
  methods: {
    handleColChange(row) { 
      this.$parent.handleChange(row);
    },
  },
  render(h) {
    return h("div", this.$slots.default);
  },
};
</script>
