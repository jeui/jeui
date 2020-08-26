<template>
  <span v-html="dateStr">
    <em ref="datetpl" v-if="showTpl">
      <slot></slot>
    </em>
  </span>
</template>
<script>

export default {
  name: "jeCountDown",
  props: {
    start: {
      type: [String, Number, Date],
      default: 0
    },
    end: {
      type: [String, Number, Date],
      default: 0
    },
    now: {
      type: [String, Number, Date],
      default: 0
    },
    notTips: { //未开始时候的提示语，可以不填
      type: String,
      default: '距离开始还有 '
    },
    hasTips: { //倒计时中的提示语，可以不填
      type: String,
      default: '距离结束还有 '
    },
    stopTips: { //结束后的提示语，默认 0天0时0分0秒 or 0时0分0秒
      type: String,
      default: '已结束'
    },
    format: {
      type: String,
      default: '{%DD}天{%HH}时{%MM}分{%SS}秒'
    }
  },
  data() {
    return {
      dateStr: "",
      interval: 1000,
      timer: null,
      showTpl: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tplformat = !!this.$slots.default ? this.$refs.datetpl.innerHTML : this.format
      this.showTpl = false;
      this.runCountDown();
    })
  },
  methods: {
    //将日期转换成时间戳
    timeToStamp(date) {
      let arrs = date.match(/\w+|d+/g),
        newdate = new Date(arrs[0], arrs[1] - 1, arrs[2], arrs[3] || 0, arrs[4] || 0, arrs[5] || 0);
      return Math.round(newdate.getTime() / 1000);
    },
    //处理日期时间
    disposeDate(dateVal) {
      let arrs = ["DD", "HH", "MM", "SS"], result = this.tplformat;
      // 为小于10 的数字补0
      const Digit = function(val){
        return val < 10 ? "0" + (val | 0) : val;
      }
      //* 匹配值处理
      let DHMS = {
        DD: Digit(Math.floor(dateVal / 3600 / 24)),
        HH: Digit(Math.floor(dateVal / 3600 % 24)),
        MM: Digit(Math.floor(dateVal / 60 % 60)),
        SS: Digit(Math.floor(dateVal % 60))
      };
      arrs.forEach((val) => {
        result = result.replace('{%' + val + '}', DHMS[val]);
      });
      return result;
    },
    runCountDown() {
      // 匹配时间
      let startTime = isNaN(this.start) ? this.timeToStamp(this.start) : Math.round(this.start),
        endTime = isNaN(this.end) ? this.timeToStamp(this.end) : Math.round(this.end),
        // 判断当前时间
        nowTime = this.now === 0 ? Math.round(new Date().getTime() / 1000) : this.timeToStamp(this.now);

      let fevalDate = () => {
        // 获取需要计时的毫秒数
        let tipStr, timeVal = nowTime < startTime ? startTime - nowTime : endTime - nowTime;
        // 活动开始倒计时
        if (nowTime < startTime) {
          tipStr = this.notTips;
          this.$emit("before",tipStr)
        } else {
          // 活动结束倒计时
          if (endTime > nowTime) {
            tipStr = this.hasTips;
            this.$emit("after",tipStr)
          } else { // 倒计时停止
            clearInterval(this.timer);
            this.dateStr = this.stopTips;
            return;
          }
        }
        this.dateStr = tipStr + this.disposeDate(timeVal);
        nowTime = nowTime + this.interval / 1000;
      };
      fevalDate();
      this.timer = setInterval(fevalDate, 1000);
    }
  }
}
</script>
