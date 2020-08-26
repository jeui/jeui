<template>
  <table class="table-wrap" cellspacing="0" cellpadding="0" border="0">
    <colgroup v-if="columnsWidth.length > 0">
    <col v-for="(vals,idx) in columnsWidth" :name="`je-table_${TUID}_column_${TUID}${idx}`" 
    :width="vals" :key="idx">
    </colgroup>
    <thead>
      <tr v-for="(vals,idx) in headColumns" :key="idx">
        <th v-for="(item,index) in vals" :key="index" :class="`je-table_${TUID}_column_${TUID}${idx}`"
        :rowspan="idx ==0 ? item.rowspan : ''" 
        :colspan="idx ==0 ? item.colspan : ''" 
        :align="item.align" :style="setHeaderStyle(item)">
          <div class="cell" v-if="item.type=='selection'">
            <jeCheckbox v-model="allCheck" :indeterminate="isIndeterminate" @change="handleSelectAll"></jeCheckbox>
          </div>
          <div class="cell" v-else-if="item.type=='index'">{{item.label}}</div>
          <div class="cell" v-else>{{item.label}}</div>
        </th>
      </tr>
    </thead> 
  </table>
</template>

<script>
import jeCheckbox from '../checkbox/Checkbox.vue';

export default {
  name: 'jeTableHead',
  props: {
    selectClass: {
      type:String,
      default:''
    },
  },
  data() {
    return {
      TUID: this.$parent.tableid,
      isIndeterminate: false,
      allCheck: false
    }
  },
  components: {
    jeCheckbox,
  },
  watch: {
    selectClass(vals) {
      this.isIndeterminate = this.selectClass === "someSelect" ? true : false;
      this.allCheck = this.selectClass === "checked" ? true : false;
    }
  },
  methods: {
    setHeaderStyle(item){ 
      let headerStyle = this.$parent.headerStyle;
      return Object.assign({},headerStyle);
    },
    handleSelectAll(){
      this.isIndeterminate = false;
      this.$parent.handleSelectAll()
    }
  },
  computed: {
    columnsWidth() {
      return this.$parent.columnsWidth;
    },
    bodyColumn() {
      return this.$parent.bodyColumns;
    },
    headColumns(){ 
      return this.$parent.headColumns;
    }
  }
}
</script>
