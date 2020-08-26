<template>
  <div class="je-datepicker" v-clickOutside="closeDate">
    <div class="je-datepicker-input" @click="toggle">
      <jeInput v-model="currValue" :width="inputWidth" suffix="icon-calendar"
      :placeholder="placeholder" :disabled="disabled" :readonly="readonly"/>
    </div>
    <transition name="jedrop">
    <div class="je-datepicker-wrap" ref="main" v-if="visible" :style="openStyle">
      <div class="datepicker-sidebar" v-if="sidebar.length>0">
        <ul>
          <li v-for="(item,index) in sidebar" :key="index" @click="changeSidebar(item)">{{item.name}}</li>
        </ul>
      </div>
      <div class="datepicker-body">
        <!-- 头部 -->
        <DateHeader v-if="updateDay" :date="currDate" :multiPane="multiPane" 
        :dateLength="dateLength" @change-panel="showDatePanel" @change-value="switchYearMonth"></DateHeader>
        <!-- 年月 -->
        <template v-if="currDate.length>0">
        <YearMonth v-if="showType !== 'Days'" :date="currDate" :multiPane="multiPane" :range="range"
        :dateLength="dateLength" :min="min" :max="max" @change="changeYearMonth"></YearMonth>
        </template>
        <!-- 日 -->
        <Days v-if="showType === 'Days' && updateDay" :date="currDate" :select="selectValue" 
        :multiPane="multiPane" :range="range"
        :dateLength="dateLength" :min="min" :max="max" @change="changeDays"></Days>   
        <!-- 时分秒 -->
        <Times v-if="showTimePanel" :class="timeClass" :date="currDate" :select="selectValue" 
        :multiPane="multiPane" :range="range" :min="min" :max="max" @change="changeTime"></Times> 
        <!-- 底部按钮 -->
        <div class="datepicker-footer">
          <span class="btnleft" @click="showTime" v-if="dateLength > 3">{{timeText}}</span>
          <span class="btnright" @click="confirm">确定</span>
          <span class="btnright" v-if="range === ''" @click="today">现在</span>
          <span class="btnright" @click="clear">清空</span>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import { DateTime, StringMatch, Merge, Digit, GetPrevMonth, GetNextMonth } from "./dateUtils.js";
import {setElementSize} from "../../utils/dom.js";
import clickOutside from "../../utils/clickoutside";
import jeInput from '../input/Input'
import DateHeader from './DateHeader'
import YearMonth from './DateYearMonth'
import Days from './DateDays'
import Times from './DateTime'
let regymdzz = "YYYY|MM|DD|hh|mm|ss|zz", gr = /\-/g, trim = /(^\s*)|(\s*$)/g;

export default {
  name: "jeDatePicker",
  directives: { clickOutside },
  components: {jeInput, DateHeader, YearMonth, Days, Times},
  props: {
    value: {
      type: [String, Number, Date],
      default: ''
    },
    sidebar: {
      type: Array,
      default() { return [] }
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD hh:mm:ss'
    },
    min: {
      type: String,
      default: '2015-01-01 00:00:00'
    }, 
    max: {
      type: String,
      default: '2900-12-31 23:59:59'
    },
    multiple:{
      type: Boolean,
      default: false
    },
    range: {
      type: String,
      default: ''
    }, 
    placeholder: {
      type: String,
      default: '请选择'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }, 
    zIndex: {
      type: Number,
      default: 1000
    },
    //是否为选中日期后关闭弹层，为false时选中日期后关闭弹层
    shutDown:{
      type: Boolean,
      default: true
    },                               
    dateInput: Function, // 选择回调
  },
  data() {
    return {
      inputWidth: "200px",
      currValue: this.value,
      multiPane: this.multiple,
      visible: false,
      openStyle: {},
      currDate: [],
      selectValue: [],
      selectDate: [],
      selectTime: [],
      formatMatch: [],
      dateLength:1,
      showType: "",
      updateDay: false,
      showTimePanel: false,
      checkValue: []
    }
  },
  watch: {
    value(val){
      this.currValue = val
    },
    currValue(val) {
      this.$emit('input',val);
    }
  },
  created() {
    if(this.range !== "") {
      this.inputWidth = "320px";
      this.multiPane = true;
    }
  },
  mounted() {
    this.formatMatch = StringMatch(this.format);
    this.formatLength();
  },
  methods: {
    toggle() {
      let time = null
      if(!this.disabled) {
        time = setTimeout(() => {
          this.visible = !this.visible
          this.visible ? this.openDate() : this.closeDate();
        },50)
      };
    },
    openDate() {
      this.startDate()
      this.$nextTick(() => {
        this.showTimePanel = false
        this.setOpenStyle();
      })
    },
    closeDate() {
      this.visible = false;
    },
    startDate() {
      let vals = [], pushVal = [], dates = [];
      if(this.range === ''){
        dates = [this.currValue]
      }else{
        dates = this.currValue !== '' ? this.currValue.split(this.range) : []
      }
      dates.forEach((date) => {
        let objs = {};
        StringMatch(date.replace(trim, "")).forEach( (val,i) => {
          objs[this.formatMatch[i]] = val;
        })
        vals.push(objs)
      })
      if(this.dateLength > 2) {
        this.showType = "Days"
      }      
      this.setSelectDate(vals)
    },
    setSelectDate(vals){
      this.selectDate = vals;
      if(this.currValue !== ''){
        this.checkValue = vals
      }
      if(vals.length === 0) {
        this.formatValue()
      }else {
        this.formatValue(vals[0].YYYY, vals[0].MM, vals[0].DD)
      }
      this.setCurrSelect()
    },
    setOpenStyle(){
      let styles = setElementSize(this.$el,this.$refs.main)
      if(this.width !== ''){
        styles.width = 'auto'
      }
      this.openStyle = Merge({zIndex: 9999}, styles)
    },
    formatLength(){
      let arr = []; 
      StringMatch(regymdzz).forEach((item) => {
        StringMatch(this.format).forEach((val) => {
          if(item == val) arr.push(val);
        });
      });
      this.dateLength = ((arr[0] == "hh") && arr.length <= 3) ? 7 : arr.length;
    },
    mergeDate(dates) {
      let date = new DateTime();
      let objs = {
        YYYY: date.GetYear(), MM: date.GetMonth(), DD: date.GetDate() , 
        hh: date.GetHours(), mm: date.GetMinutes(), ss: date.GetSeconds()
      }
      return Merge({}, objs, dates || {})
    },
    getYearMonthDay(year, month, day) {
      let date = this.mergeDate();
      year = year ? year : date.YYYY; 
      month = month ? month : date.MM;
      day = day ? day : date.DD;
      return {year, month, day}
    },
    formatValue(year, month, day) {
      let date = this.getYearMonthDay(year, month, day), 
        next = GetNextMonth(date.year, date.month),
        ymdObjs = {YYYY: date.year, MM: date.month, DD: date.day};
      let objsCheck = this.mergeDate(ymdObjs),
        objsOne = this.mergeDate(ymdObjs),
        objsTwo = this.mergeDate({YYYY: next.YYYY, MM: next.MM});
      if(this.multiPane && this.range !== "" && this.currValue === '' && this.selectDate.length === 0) {
        this.checkValue = [objsCheck]
        this.selectDate = [objsOne]
      }
      this.$nextTick(() => {
        this.$set(this,'currDate',this.multiPane ? [objsOne, objsTwo] : [objsOne])
        this.updateDay = true;
      })
      return {prev:objsOne, next:objsTwo}
    },

    setCurrSelect(year, month, day) {
      let date = this.getYearMonthDay(year, month, day);
      let objsOne = this.mergeDate({YYYY: date.year, MM: date.month, DD: date.day}),
        objsValue = this.mergeDate({YYYY: 0, MM: 0, DD: 0});
      let sel = this.checkValue, single = [Merge(objsOne,sel[0]||{})],
        double = [Merge(objsOne,sel[0]||{}),Merge(objsValue,sel[1]||{hh:0, mm:0, ss:0})];
      this.$set(this,'selectValue',this.multiPane && this.range !== "" ? double : single)
    },
    showDatePanel(val) {
      this.showType = val;
    },
    changeSidebar(item) {
      let vals =  Object.prototype.toString.call(item.value)=="[object Function]" ? item.value(this) : item.value; 
      let date = new DateTime(), val = date.GetValue(), objs = vals || {}, newArr = [],
        mats = {YYYY:"FullYear", MM:"Month", DD:"Date", hh:"Hours", mm:"Minutes", ss:"Seconds"};
      let arr = Object.keys(objs);
      if(arr.length === 0) return;
      arr.forEach((mat,i) => {
        if (parseInt(objs[mat]) || parseInt(objs[mat]) == 0) {
          val["set" + mats[mat]](date["Get" + mats[mat]]() + (mat == "MM" ? -1 : 0) + parseInt(objs[mat]));
        }
      })
      newArr.push(this.mergeDate())
      if(this.range !== "") {
        newArr.push({
          YYYY: date.GetYear(), MM: date.GetMonth(), DD: date.GetDate() , 
          hh: date.GetHours(), mm: date.GetMinutes(), ss: date.GetSeconds()
        })
      }
      
      this.$set(this,'checkValue',newArr);
      this.formatValue(newArr[0].YYYY, newArr[0].MM, newArr[0].DD)
      this.setCurrSelect(newArr[0].YYYY, newArr[0].MM, newArr[0].DD)
    },
    switchYearMonth(objs) {
      let SD = this.selectDate;
      if(objs.type === "Year") {
        let year = SD[0].YYYY + (objs.direction === "left" ? -1 : 1)
        Merge(SD[0],{YYYY: year})
      }else if(objs.type === "Month") {
        let year = SD[0].YYYY, month = SD[0].MM;
        let PN = objs.direction == 'left' ? GetPrevMonth(year, month) : GetNextMonth(year, month);
        Merge(SD[0],{YYYY: PN.YYYY, MM: PN.MM})
      }
      this.formatValue(SD[0].YYYY, SD[0].MM, 0)
    },
    changeYearMonth(objs) {
      let SD = this.selectDate;
      let objVal = objs.type === "Year" ? {YYYY: objs.value} : {MM: objs.value};
      Merge(SD[0], objVal);
      this.formatValue(SD[0].YYYY, SD[0].MM, 0)
    },   
    changeDays(vals) {
      let newArr = []
      if(this.multiPane && this.range !== "") {
        if(this.checkValue.length === 2) {
          newArr.push({ YYYY: vals.year, MM: vals.month, DD: vals.day })
          this.checkValue = newArr;
        }else{
          this.checkValue.push({ YYYY: vals.year, MM: vals.month, DD: vals.day });
          this.checkValue.sort((a,b) => {
            return new Date(a.YYYY,a.MM,a.DD).getTime() - new Date(b.YYYY,b.MM,b.DD).getTime()
          })
          newArr = this.checkValue;
        }
      }else {
        newArr.push({ YYYY: vals.year, MM: vals.month, DD: vals.day })
      }
      this.$set(this,'checkValue',newArr);
      this.formatValue(newArr[0].YYYY, newArr[0].MM, newArr[0].DD)
      this.setCurrSelect(newArr[0].YYYY, newArr[0].MM, newArr[0].DD)
      this.$nextTick(() => {
        if(this.range === "" && this.checkValue.length === 1){
          this.setDateValue(this.selectValue)
          this.closeDate()
        }
      })
    },
    changeTime(date) {
      let array = []
      date.forEach(val => {
        array.push({hh:val.hh, mm:val.mm, ss:val.ss})
      })
      this.selectTime = array
    },
    //转换日期格式
    parse(vals, format) {
      return format.replace(new RegExp(regymdzz,"g"), function(str, index) {
        return vals[str];
      });
    },
    setDateValue(vals) {
      let newVals = [], multiRange = this.multiPane && this.range !== "";
      vals.forEach((item,index) => {
        if(this.selectTime.length > 0) {
          Merge(item, this.selectTime[index]);
        }else {
          let times = index === 1 ? {hh:0, mm:0, ss:0} : {};
          Merge(item, times);
        }
        Object.keys(item).forEach(val => {
          item[val] = Digit(item[val])
        })
        newVals.push(this.parse(item, this.format));
      })
      let range = multiRange ? this.range.replace(trim, "").replace(trim, " ") : "";
      this.$emit('change',multiRange ? newVals : newVals[0])
      this.currValue = newVals.join(range)
    },
    showTime() {
      this.showTimePanel = !this.showTimePanel;     
    },
    // 清空日期值
    clear(){
      this.currValue = '';
      this.selectTime = []
      this.startDate()
      this.closeDate()
    },
    // 现在
    today(){
      this.currValue = '';
      this.startDate()
      this.closeDate()
      this.$nextTick(() => {
        this.setDateValue(this.selectValue)
      })
    },
    // 确定
    confirm(){
      if(this.range !== "" && this.checkValue.length === 2) {
        this.setDateValue(this.selectValue)
      }
      this.closeDate()
    }
  },
  computed: {
    timeClass() {
      return this.dateLength > 3 && this.dateLength <= 6 ? "datepicker-fixed" : "";
    },
    timeText() {
      return this.showTimePanel ? "返回日期" : "选择时间";
    }
  }
}
</script>
