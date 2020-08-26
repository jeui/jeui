<template>
<div class="datepicker-content">
  <div class="datepicker-year-month" v-for="(val, index) in date" :key="index">
    <!-- <ul class="yearlist">
      <li v-for="(item, index) in yearList" :key="index" :class="item.style">{{item.value}}</li>
    </ul> -->
    <div class="yearlist" :class="yearClass">
      <table>
        <tr v-for="(item,idx) in yearList" :key="idx">
          <td v-for="(y,ids) in item" :key="ids" :class="y.style" @click="clickYearMonth(y.value,'Year')">{{y.value}}</td>
        </tr>
      </table>
    </div>
    <div v-if="dateLength>1" class="monthlist" ref="month">   
      <Scrollbar :scrollTop="ymTop[index]"> 
      <p v-for="(m,ids) in monthList[index]" :key="ids" :class="m.style" 
      @click="clickYearMonth(m.value,'Month')">{{m.value}}月</p>
      </Scrollbar>
    </div>
  </div>
</div>
</template>

<script>
import Scrollbar from '../scrollbar/Scrollbar.vue'
export default {
  name: "DateYear",
  props: {
    date:{
      type: Array,
      default() { return [] }
    },
    multiPane: {
      type: Boolean,
      default: false
    },
    dateLength: {
      type: Number,
      default: 1
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
  components: {
    Scrollbar
  },
  data() {
    return {
      ymTop: [0,0],
      yearList: [],
      monthList:[]
    }
  },
  watch: {
    date() {
      this.initRender();
    }
  },
  mounted() {   
    this.initRender();
    this.$nextTick(() => {  
      if(this.dateLength > 1) {
        this.setScrollTop()
      }
    })
  },
  methods: {
    initRender() {
      this.renderYear();
      this.renderMonth();
    },
    renderYear() {
      let year = this.date[0].YYYY, array = [], result = [];
      let yearArr = this.multiPane ? [year, year+20] : [year]
      yearArr.forEach(item => {
        for (let i = item - 10; i <= item + 10; i++) {
          let clsVal = "";
          // if(this.pane == 0){
          //   clsVal = i==year ? "selected" : ""
          // }
          if(i === year){
            clsVal = "selected";
          }
          array.push({
            style: clsVal,
            value: i
          })
        }
      })
      for(let i=0; i<array.length; i+=3){
        result.push(array.slice(i,i+3));
      }
      this.yearList = result
    },
    renderMonth() {
      let monthList = []
      this.date.forEach((item, index) => {
        let array = [], result = [];
        for(let i=1; i <= 12; i++) {
          let clsVal = "", ys = `${i < 10 ? '0' + i : i}`;
          if(i === item.MM){
            clsVal = "selected";
          }
          array.push({
            style: clsVal,
            value: ys
          })      
        }
        monthList.push(array)
      })
      this.$set(this,'monthList',monthList);
    },
    clickYearMonth(vals, type) {
      this.$emit('change', {value: parseInt(vals), type})
    },
    setScrollTop(){   
      let topArr = [];  
      this.$refs.month.forEach((el) => {
        let topVal = el.querySelector('p.selected').offsetTop;   
        topArr.push(topVal - 97)
      })
      this.$set(this,'ymTop',topArr)
    }
  },
  computed:{
    yearClass() {
      return this.dateLength === 1 ? ['year-full'] : ''
    }
  }
}
</script>
