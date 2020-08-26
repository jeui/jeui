<template>
<div class="datepicker-content">
  <div class="datepicker-days" v-for="(days,dkey) in daysList" :key="dkey">
    <table cellspacing="1" cellpadding="0">
      <tr>
        <th v-for="(week,index) in weeks" :key="index">{{week}}</th>
      </tr>
      <tr v-for="(item,index) of days" :key="index">
        <td v-for="(val,idx) of item" :key="idx" :class="val.style" @click.stop="changeDays(val)" :day="val.ymd">
          {{val.day}}
        </td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import { DateTime, ContrastObjs, StringMatch, Digit,GetPrevMonth, GetNextMonth } from "./dateUtils.js";
const date = new DateTime();
export default {
  name: "DateDays",
  props: {
    date: {
      type: Array,
      default() { return [] }
    },
    select: {
      type: Array,
      default() { return [] }
    },
    dateLength: {
      type: Number,
      default: 1
    },
    multiPane: {
      type: Boolean,
      default: false
    },
    range: {
      type: String,
      default: ""
    },
    min: {
      type: String,
      default: ""
    },
    max: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
      daysList: [],
      dayValue: {},
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  },
  watch:{
    date(){
      this.initDays()
    }
  },
  created() {
    this.dayValue = {
      year: this.date.YYYY ? this.date.YYYY : date.GetYear(),
      month: this.date.MM ? this.date.MM : date.GetMonth(),
      day: this.date.DD ? this.date.DD : date.GetDate()
    }
  },
  mounted() {
    this.initDays()
  },
  methods: {
    initDays(){
      let daysList = [];
      this.date.forEach(item => {
        let result = [], days = this.renderDays(item.YYYY, item.MM, 1)
        for(let i=0; i<days.length; i+=7){
          result.push(days.slice(i, i+7));
        }
        daysList.push(result)
      })
      this.daysList = daysList;
    },
    renderDays(y, m, d) {
      let yd = parseInt(y), md = parseInt(m), ds = parseInt(d);
      let count = 0, daysArr = [], firstWeek = new Date(yd, md - 1, 1).getDay() || 7, daysNum = this.getMonthTotal(yd, md),
        prevM = GetPrevMonth(yd, md), prevDaysNum = this.getMonthTotal(yd, prevM.MM), nextM = GetNextMonth(yd, md),
        mins = StringMatch(this.min), minNum = parseInt(`${mins[0]}${Digit(mins[1])}${Digit(mins[2])}`),
        maxs = StringMatch(this.max), maxNum = parseInt(`${maxs[0]}${Digit(maxs[1])}${Digit(maxs[2])}`);
        
      const prevNextCls = val => { return val < minNum || val > maxNum ? "disabled" : "other"; };

      //上一月剩余天数
      for ( let p = prevDaysNum - firstWeek + 1; p <= prevDaysNum; p++, count++ ) {
        // var pmark = setMark(prevM.y,prevM.m,p), pcls = dateLimit(prevM.y, prevM.m, p, false) ? "disabled" : "other";
        // pcls = regExpDate(p,pcls);
        let pCls = prevNextCls(`${prevM.YYYY}${Digit(prevM.MM)}${Digit(p)}`);
        
        daysArr.push({
          style: pCls,
          ymd: `${prevM.YYYY}-${prevM.MM}-${p}`,
          year: prevM.YYYY,
          month: prevM.MM,
          day: p
        });
      }
      //本月的天数
      for (let b = 1; b <= daysNum; b++, count++) {
        // let rangeDate = this.range ==='' ? this.dayValue : date.GetYear()+'-'+date.GetMonth()+'-'+date.GetDate();
        let bCls = "", 
        // currDay = { YYYY: yd, MM: Digit(md), DD: Digit(b) }, 
        currDate = `${yd}${Digit(md)}${Digit(b)}`; 
        let rds = this.select;
        let oneDate = `${rds[0].YYYY}${Digit(rds[0].MM)}${Digit(rds[0].DD)}`,
          twoDate = rds[1] ? `${rds[1].YYYY}${Digit(rds[1].MM)}${Digit(rds[1].DD)}` : '';
        const isEqual = () => rds.length > 1 ? (oneDate == currDate || twoDate == currDate) : oneDate == currDate;
        if (currDate >= minNum && currDate <= maxNum) {
          if ( isEqual() ) {
            bCls = "selected";
          } else if ( this.range !== ""&& currDate > oneDate && currDate < twoDate ) {
            bCls = "contain";
          } 
          else {
            bCls = "";
          }
        } else {
          bCls = "disabled";
        }

        daysArr.push({
          style: bCls,
          ymd: `${yd}-${md}-${b}`,
          year: yd,
          month: md,
          day: b
        });
      }
      //下一月开始天数
      for (let n = 1, nlen = 42 - count; n <= nlen; n++) {
        let nCls = prevNextCls(`${nextM.YYYY}${Digit(nextM.MM)}${Digit(n)}`);       
        daysArr.push({
          style: nCls,
          ymd: `${nextM.YYYY}-${nextM.MM}-${n}`,
          year: nextM.YYYY,
          month: nextM.MM,
          day: n
        });
      }
      return daysArr;
    },
    //获取本月的总天数
    getMonthTotal(y, m) {
      let num = 31, leap = (y % 100 !== 0 && y % 4 === 0) || y % 400 === 0;
      switch (parseInt(m)) {
        case 2:
          num = leap ? 29 : 28;
          break;
        case 4: case 6: case 9: case 11:
          num = 30;
          break;
      }
      return num;
    },
    changeDays(item) {
      this.$emit('change', item)
    }
  }
};
</script>

