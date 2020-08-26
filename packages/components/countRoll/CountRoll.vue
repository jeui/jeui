<template>
  <span>{{countValue}}</span>
</template>
<script>
// https://www.imooc.com/article/290891
// https://github.com/singod/countUp.js
import Countup from './countup'
export default {
  name: "jeCountRoll",
  props: {
    start: {
      // 能否执行动画，默认true
      type: Boolean,
      default: true
    },
    startVal: {
      // 起始值必填
      type: Number,
      default: 1
    },
    endVal: {
      // 结束值，必填
      type: Number,
      required: true
    },
    decimals: {
      // 小数位数，默认不要小数部分
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
    return {
      duration:2,
      countValue:0
    }
  },
  watch: {
    start(val) {
      if (val) {
        this._countup.start();
      }
    },
    endVal(val) {
      this._countup.update(val);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._countup = new Countup(
        this.startVal,
        this.endVal,
        this.decimals,
        this.duration,
        this.options
      );
      if (this.start) {
        this._countup.start((vals)=>{
          this.countValue = vals
        });
      }
    });
  }
};

</script>
