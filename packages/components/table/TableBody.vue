<template>
  <table cellspacing="0" cellpadding="0" border="0" class="table-wrap">
    <colgroup v-if="columnsWidth.length > 0">
    <col v-for="(vals,idx) in columnsWidth" :name="`je-table_${TUID}_column_${TUID}${idx}`" 
    :width="vals" :key="idx">
    </colgroup>
    <tbody v-if="data.length===0">
      <tr>
        <td :colspan="bodyColumn.length" class="empty">{{emptyText}}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <template v-for="(row,index) in data">
      <tr :key="index">
        <td v-for="(item,idx) in bodyColumn" :key="idx" :align="item.align" 
        :class="`je-table_${TUID}_column_${TUID}${idx}`">
          <TableTd :column="item" :row="row" :index="idx" />
        </td>       
      </tr>
      <tr :key="'extend-'+index" v-if="colsExtend.length>0" >
        <td v-for="(item,idx) in colsExtend" :colspan="data.length" :key="idx">
          <TableTd :column="item" :row="row" :index="idx"/>
        </td>
      </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
// table td
const TableTd = {
  props: ["column", "row", "index", "title"],
  render(h) {
    let row = this.row, column = this.column;
    let $index = this.index, title = this.title;
    if (column.$children.length > 0) {
      let fields = [],
      coleach = (function coleach(cols) {
        if (cols.$children.length > 0) {
          cols.$children.forEach((val) => {
            fields.push(val.prop);
            if (val.$children && val.$children.length > 0) {
              coleach(val);
            }
          });
        }
      })(column);
      column.prop = fields[fields.length - 1];
    }
    let rescols = column.renders.call(this, h, {
      row,
      $index,
      column,
    });
    return (<div class="cell">{rescols}</div>);
  },
};

export default {
  name: "jeTableBody",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  components: { TableTd },
  data() {
    return {
      TUID: this.$parent.tableid,
    };
  },
  mounted() {},
  methods: {},
  computed: {
    columnsWidth() {
      return this.$parent.columnsWidth;
    },
    bodyColumn() {
      return this.$parent.bodyColumns;
    },
    colsExtend () {
      return this.$parent.columnsExtend
    },
    isExtend() {
      // 返回有没存在type=extend的列
      let extend = false;
      this.cols.forEach((item) => {
        if (item.type === "extend") {
          extend = true;
        }
      });
      return extend;
    },
  },
  render(h) {
    return h("div", this.$slots.default);
  },
};
</script>
