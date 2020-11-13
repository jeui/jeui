<template>
  <div class="je-table">
    <div class="table-box" :style="{width:width,height:tableHeight}" ref="box">
      <div class="hidden-column" ref="hiddenColumns"><slot></slot></div>
      <div class="table-header" :style="{paddingRight:barWidth + 'px'}" v-if="showHeader">
        <div class="table-thead" ref="headwrap">
        <TableHead :selectClass="selectChecked" :style="{width:totalWidth }"></TableHead>
        </div>
      </div>
      <div class="table-body" :style="{height:bodyHeight}" @scroll.stop="handleScrollBody" ref="bodywrap">
        <TableBody :data="tableData" :style="{width:totalWidth }"></TableBody>
      </div>
      <template v-if="leftData.length > 0">
        <div class="table-fixed left" :style="{bottom:`${barWidth}px`}" v-show="leftShadow">
          <div class="table-header" :style="{width:leftWidth + 'px'}" v-if="showHeader">
            <TableHead :selectClass="selectChecked" :style="{width:totalWidth ,float:'left'}"></TableHead>
          </div>
          <div class="table-body" :style="{width:leftWidth + 'px'}" v-mousewheel="handleScrollFixed" ref="leftfixbody">
            <TableBody :data="tableData" :style="{width:totalWidth ,float:'left'}"></TableBody>
          </div>
        </div>
      </template>
      <template v-if="rightData.length > 0">
        <div class="table-fixed right" :style="{bottom:`${barWidth}px`,right:(rightShadow ? barWidth:0) + 'px'}" v-show="rightShadow">
          <div class="table-header" :style="{width:rightWidth + 'px'}" v-if="showHeader">
            <TableHead :selectClass="selectChecked" :style="{width:totalWidth ,float:'right'}"></TableHead>
          </div>
          <div class="table-body" :style="{width:rightWidth + 'px'}" v-mousewheel="handleScrollFixed" ref="rightfixbody">
            <TableBody :data="tableData" :style="{width:totalWidth ,float:'right'}"></TableBody>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Emitter from "../../utils/emitter";
import { findComponentsDownward } from "../../utils/findComponent";
import TableHead from "./TableHead.vue";
import TableBody from "./TableBody.vue";
import MouseWheel from "./mouseWheel";

export default {
  name: "jeTable",
  mixins: [Emitter],
  props: {
    width: {
      type: [String, Number],
      default: "100%",
    },
    height: {
      type: [String, Number],
      default: "",
    },
    data: {
      type: [Array, String],
      default() {
        return [];
      },
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    radio: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: "暂无数据",
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    headerStyle: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    TableHead,
    TableBody,
  },
  directives: {
    mousewheel: {
      bind(element, binding) { 
        MouseWheel(element, binding.value)       
      }
    }
  },
  data() {
    return {
      tableid: Math.random().toString(36).substr(6),
      tableData: this.data || [],
      columns: [],
      columnsFilter: [], // 表头，过滤掉扩展列的
      columnsExtend: [], 
      checkRows: [], // 已选择的行
      selectChecked: "unSelect", // 全选状态 unSelect为全不选，someSelect选择了部分，checked全选
      leftData: [],
      leftWidth: 0,
      rightData: [],
      rightWidth: 0,
      tableWidth: "",
      tableHeight: "",
      totalWidth: "0px",
      caclWidth: 0,
      allWidth: 0,
      fixedWidth: 0,
      surplusWidth: 0,
      barWidth: 0,
      bodyHeight: "",
      botScroll: false,
      leftShadow: false,
      rightShadow: true,
      maxLine: 1, //表头总共占的行数
      headColumns: [],
      bodyColumns: [],
      columnsWidth: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.hiddenColumns.remove();    
      this.getAllColumn();
      this.windowResize();          
    })
  },
  computed: {},
  methods: {
    getAllColumn() {
      this.$nextTick(() => {        
        let columns = [], leftWidth = 0, rightWidth = 0;
        this.barWidth = this.getScrollbarWidth();
        // 遍历子组件，只返回column组件
        this.recursionProps(this.$children).forEach((child) => {
          columns.push(child);
          if (child.fixed == "left") {
            this.leftData.push(child);
            leftWidth += child.colWidth;
          }
          if (child.fixed == "right") {
            this.rightData.push(child);
            rightWidth += child.colWidth;
          }
        });
        // 设置左浮动的总宽度
        this.$set(this, "leftWidth", leftWidth - 1);
        // 设置右浮动的总宽度
        this.$set(this, "rightWidth", rightWidth - 1);
        this.$set(this, "columns", columns);
        // 返回过滤掉扩展列的
        this.columnsExtend = columns.filter(item => item.type === "extend");
        // 返回过滤掉扩展列的
        this.columnsFilter = columns.filter(item => item.type !== "extend");             
        this.handleColumns();
        this.handleBodyColumns();
        this.calcAllWidth()
      });
    },  
    recursionProps(children) {
      let columns = []
      children.forEach((child) => {
        if (child.$options.name === "jeTableColumn") {
          child.colChildren = [];
          if(child.$children && child.$children.length > 0) {
            child.colChildren = this.recursionProps(child.$children);
          }
          child.colWidth = parseInt(child.width);
          child.colMinWidth = parseInt(child.minWidth || 80);
          columns.push(child)
        }
      })
      return columns;
    },
    calcAllWidth() {
      let allColsWidth = [], widthValue = 0, miniWidthSize = 0, rawWidth = 0,
        boxWidth = this.$refs.box.clientWidth, totalWidth = 0;      
            
      // 递归遍历出所有宽度
      (function everyWidth(childs) {
        childs.forEach((child) => {
          if (child.$children && child.$children.length > 0) {
            everyWidth(child.$children);
          } else {
            let currWidth = child.width ? {colWidth: child.colWidth} : {colMinWidth: child.colMinWidth};
            allColsWidth.push(currWidth);
          }
        });
      })(this.columnsFilter);
      // 遍历出剩余的值
      allColsWidth.forEach(item => {
        rawWidth += (item.colWidth ? item.colWidth : item.colMinWidth);
        if(item.colMinWidth && item.colMinWidth > 0) miniWidthSize += 1;
        if(item.colWidth && item.colWidth > 0) widthValue += item.colWidth;
      });
      if(rawWidth < boxWidth) {
        let surplusWidth = boxWidth - widthValue, minPer = {}, total = 0;
        // 遍历计算出剩余知道百分比
        allColsWidth.forEach((item, i) => {
          if (item.colMinWidth && item.colMinWidth > 0) {
            let fixVal = (Math.floor(item.colMinWidth) / surplusWidth) * 100;
            minPer[`${i}`] = parseInt(fixVal);
            total += parseInt(fixVal);
          }
        });
        // 根据剩余值和剩余百分比计算出真正值
        let surplusPers = Math.floor((100 - total) / miniWidthSize);
        for (let k in minPer) {
          let realWidth = Math.floor(surplusWidth * (minPer[k] + surplusPers) / 100);
          // 判断计算后的值是否大于最小值
          if(realWidth > allColsWidth[k].colMinWidth) {
            allColsWidth[k].colMinWidth = realWidth;
          }
        }
      }
      this.columnsWidth = [];
      allColsWidth.forEach(item => {
        let width = item.colWidth && item.colWidth > 0 ? item.colWidth : item.colMinWidth;
        this.columnsWidth.push(width);
        totalWidth += width;
      })

      this.$nextTick(() => {
        if (/^\d+$/.test(this.height)) {
          let headHeight = this.$refs.headwrap.offsetHeight;
          this.tableHeight = `${this.height}px`;
          this.bodyHeight = `${parseInt(this.height) - headHeight}px`;
        } else {
          this.tableHeight = this.height;
        } 
        this.$nextTick(() => {
          let bodyWrap = this.$refs.bodywrap;
          let currCaclWidth = totalWidth
          if(totalWidth > boxWidth) {
            currCaclWidth = totalWidth;
          }
          if(bodyWrap.scrollHeight > bodyWrap.offsetHeight){
            currCaclWidth = totalWidth - this.barWidth - 1;
          }else{
            currCaclWidth = boxWidth;
          }
          this.caclWidth = currCaclWidth;
          this.totalWidth = `${currCaclWidth}px`;
          if (this.caclWidth <= boxWidth) {
            this.rightShadow = false;
          }
        })
      })
      
    },
    setWidthState() {

    },
    headerColspan(items) {
      let max = 0;
      (function getMaxCol(data) {
        if (max < data.length) max = data.length;
        data.forEach((item) => {
          if (item.$children) {
            getMaxCol(item.$children);
          }
        });
      })(items);
      return max;
    },
    headerRowspan(children) {
      let max = 0;
      (function getMaxLine(childs, floor) {
        childs.forEach((child) => {
          if (floor > max) max = floor;
          if (child.$children && child.$children.length > 0) {
            getMaxLine(child.$children, floor + 1);
          }
        });
      })(children, 1);
      return max;
    },
    handleBodyColumns() {
      let cols = [];
      const forColumn = (childs) => {
        childs.forEach((child) => {
          if (child.$children && child.$children.length > 0) {
            forColumn(child.$children);
          } else {
            cols.push(child);
          }
        });
      };
      forColumn(this.columnsFilter);   
      this.bodyColumns = cols;
    },
    handleColumns() {
      let maxLine = this.headerRowspan(this.columnsFilter) || 1;
      this.headColumns.push([]);
      const colsEach = (data, index) => {
        if (this.headColumns[index] === undefined) {
          this.headColumns[index] = [];
        }
        data.forEach((item) => {
          item.last = false;
          if (item.$children && item.$children.length > 0) {
            item.colspan = this.headerColspan(item.$children);
            item.rowspan = maxLine - this.headerRowspan(item.$children);
            colsEach(item.$children, index + 1);
          } else {
            item.rowspan = maxLine;
            item.colspan = 1;
            item.last = true;
          }
          this.headColumns[index].push(item);
        });
      };
      colsEach(this.columnsFilter, 0);
    },
    windowResize() {
      window.addEventListener( "resize", () => {
        this.calcAllWidth();
        let bodyWrap = this.$refs.bodywrap;
        let compare = bodyWrap.scrollHeight > bodyWrap.clientHeight ? true : false;
        this.rightShadow = this.caclWidth <= this.$el.clientWidth ? false : true;
      }, false );
    },
    // 获取浏览器滚动条的宽度
    getScrollbarWidth() {
      let e = document.createElement("div"), sw;
      e.style.cssText = `width:100px;height:100px;position:absolute;top:-99999px;overflow:scroll;`;
      document.body.appendChild(e);
      sw = e.offsetWidth - e.clientWidth;
      document.body.removeChild(e);
      return sw;
    },
    // 设置滚动条值
    handleScrollBody(ev) { 
      let bodyWrap = this.$refs.bodywrap;
      let scrollLeft = ev.target.scrollLeft, scrollTop = ev.target.scrollTop;
      bodyWrap.scrollTop = scrollTop;
      if (this.leftData.length > 0) {
        this.$refs.leftfixbody.scrollTop = scrollTop;
        this.leftShadow = scrollLeft > 0 ? true : false;
      }
      if (this.rightData.length > 0) {
        this.$refs.rightfixbody.scrollTop = scrollTop;
        // let compare = bodyWrap.scrollHeight > bodyWrap.clientHeight ? true : false;
        this.rightShadow = (bodyWrap.scrollWidth - scrollLeft === bodyWrap.clientWidth) ? false : true;
      }    
      this.$refs.headwrap.scrollLeft = scrollLeft;
    },
    handleScrollFixed(event, data) {
      let bodyWrap = this.$refs.bodywrap;
      if (Math.abs(data.spinY) > 0) {
        const currentScrollTop = bodyWrap.scrollTop;
        if (data.pixelY < 0 && currentScrollTop !== 0) {
          event.preventDefault();
        }
        if (data.pixelY > 0 && bodyWrap.scrollHeight - bodyWrap.clientHeight > currentScrollTop) {
          event.preventDefault();
        }
        bodyWrap.scrollTop += Math.ceil(data.pixelY / 1);
      } else {
        bodyWrap.scrollLeft += Math.ceil(data.pixelX / 1);
      }
    },
    getAllCheck() {
      return this.checkRows;
    },
    clearCheck() {
      // 用于多选表格，清空用户的选择
      this.checkRows.splice(0, this.checkRows.length);
      this.selectChecked = "unSelect";
    },
    toggleAllCheck() {
      // 用于多选表格，切换所有行的选中状态
      this.checkRows = [...this.tableData];
      this.selectChecked = "checked";
    },
    toggleRowSelection(row, selected) {
      // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）row, selected
      const index = this.checkRows.indexOf(row);
      if (selected === false) {
        // 取消勾选当前行
        if (index !== -1) this.checkRows.splice(index, 1);
      } else {
        // 勾选当前行，没有时添加。有时不重复添加
        if (index === -1) this.checkRows.push(row);
      }
    }, 
    // 全选或返选状态
    selectStatus() {
      if (this.checkRows.length === this.tableData.length) {
        this.selectChecked = "checked";
      } else {
        this.selectChecked = this.checkRows.length > 0 ? "someSelect" : "unSelect";
      }
    },
    // 单选
    handleChange(row) {
      // 提供给column引用 ，单选行时
      // 单选checkbox，选中时将当前行信息存入checkRows，没勾选时删除
      const index = this.checkRows.indexOf(row);
      if (index !== -1) {
        this.checkRows.splice(index, 1);
      } else {
        this.checkRows.push(row);
      }
      // 全选时将selectAll也选上
      this.selectStatus();
      this.$emit('select',{selection: this.checkRows, row})
    },
    // 全选
    handleSelectAll() {
      this.selectChecked === "checked" ? this.clearCheck() : this.toggleAllCheck()
      this.$emit('select-all',{selection: this.checkRows})
    },
  },
};
</script>

