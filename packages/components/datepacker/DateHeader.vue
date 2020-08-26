<template>
<div class="datepicker-header">
  <h3 class="datepicker-header-list" v-for="(date,index) in headerList" :key="index">
    <em @click.stop="clickYearMonth(index,'left','Year')" v-if="singleDoubleArrow(index,'left')">
      <DoubleArrow></DoubleArrow>
    </em>
    <em @click.stop="clickYearMonth(index,'left','Month')" v-if="singleDoubleArrow(index,'left')">
      <SingleArrow></SingleArrow>
    </em>
    <div class="dateym">
      <span @click.stop="showPanel('YearMonth')">{{yearMonthText(date)}}</span>
    </div>
    <em @click.stop="clickYearMonth(index,'right','Month')" v-if="singleDoubleArrow(index,'right')">
      <SingleArrow style="transform:scaleX(-1);"></SingleArrow>
    </em>
    <em @click.stop="clickYearMonth(index,'right','Year')" v-if="singleDoubleArrow(index,'right')">
      <DoubleArrow style="transform:scaleX(-1);"></DoubleArrow>
    </em>
  </h3>
</div>
</template>

<script>
// 双箭头
const DoubleArrow = {
  template:'<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M374.78374998 485.37593751l-3.07218749 3.07218749c-10.2403125 12.79968749-10.24031251 33.2803125 2e-8 45.56812499l335.87156247 413.69625001c10.2403125 12.79968749 26.62406249 12.28781253 37.37625002 0 10.2403125-12.79968749 10.24031251-33.2803125 0-45.56812501l-316.92843752-390.14437499 317.44031251-391.168125c10.2403125-12.79968749 10.24031251-33.2803125 3e-8-45.56812499s-27.1359375-12.79968749-37.37625002 0l-333.3121875 410.11218748z"></path><path d="M550.911875 956.41624999c10.2403125-12.79968749 10.24031251-33.2803125 0-45.568125l-316.9284375-390.144375 317.44031251-391.16812499c10.2403125-12.79968749 10.24031251-33.2803125 0-45.568125-10.2403125-12.79968749-27.1359375-12.79968749-37.37625001 0l-333.8240625 411.13593751-3.07218747 3.07218749c-10.2403125 12.79968749-10.24031251 33.2803125 0 45.56812499l335.87156247 413.69625c10.7521875 11.7759375 27.64781251 11.7759375 37.888125-1.02374997z"></path></svg>'
};
// 单箭头
const SingleArrow = {
  template:'<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M611.70614468 76.02455093a23.90890969 23.90890969 0 0 1 16.99583626 7.06081314c9.34598343 9.38531719 9.31336595 24.57086062-0.07195126 33.91684406l-387.97823063 386.33102812 386.33006815 387.97918969c9.34598343 9.38627625 9.31336594 24.57182062-0.07195127 33.91780405-9.38627625 9.3469425-24.57182062 9.314325-33.91780311-0.07195124l-403.25395408-404.97406781a23.98182 23.98182 0 0 1 0.07195125-33.91780313l404.97310781-403.252995a23.91274687 23.91274687 0 0 1 16.9229269-6.98886188z"></path></svg>'
};
import { Digit } from "./dateUtils.js";
export default {
  name: "DateHeader",
  props: {
    date: {
      type: Array,
      default() { return [] }
    },
    multiPane: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DoubleArrow,
    SingleArrow
  },
  data() {
    return {
      headerList: this.date,
      visiblePanel: false,
    }
  },
  watch: {
    date(vals) {
      this.headerList = vals
    }
  },
  methods: {
    showPanel(type) {
      this.visiblePanel = !this.visiblePanel;
      let vals = this.visiblePanel ? type : "Days";
      this.$emit("change-panel", vals);
    },
    clickYearMonth(index, direction, type) {
      this.$emit("change-value", { index, direction, type });
    },
    // 单双面板的箭头显示
    singleDoubleArrow(index, direction) {
      let isShow = false;
      if (this.multiPane) {
        if ( (index === 0 && direction === "left") || (index === 1 && direction === "right") ) {
          isShow = true;
        } else {
          isShow = false;
        }
      } else {
        isShow = true;
      }
      return isShow;
    },
    yearMonthText(date) {
      return `${date.YYYY}年 ${Digit(date.MM)}月`
    }
  }
};
</script>