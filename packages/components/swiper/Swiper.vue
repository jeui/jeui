<template>
  <div class="je-swiper" @mouseenter.stop="stop" @mouseleave.stop="start">
    <div class="swiper-box">
      <div class="swiper-wrap" :style="{width:totalWidth}">
        <slot></slot>
      </div>
      <transition v-if="arrowDisplay" name="swiper-arrow-left">
        <button v-show="(arrow === 'always' || hover) && loop" type="button" 
        class="swiper-arrow swiper-arrow-left" @click.stop="prev">
          <Icon type="icon-line-left" size="18px" />
        </button>
      </transition>
      <transition v-if="arrowDisplay" name="swiper-arrow-right">
        <button v-show="(arrow === 'always' || hover) && loop" type="button" 
        class="swiper-arrow swiper-arrow-right" @click.stop="next">
          <Icon type="icon-line-right" size="18px" />
        </button>
      </transition>
    </div>
    <div :class="pagePosition" v-if="autoPage">
      <template v-if="$scopedSlots.nav">
        <div v-for="(item,index) in allSwiper" :key="index">
          <slot name="nav" :item="item" :index="index"></slot>
        </div>
      </template>
      <ul v-else>
        <li class="dotted" v-for="(item,index) in allSwiper" :key="index" 
        @mouseenter="handleIndicatorHover(index)" @click="handleIndicatorClick(index)"
        :class="{active:index+1 == swiperIndex+1}"></li>
      </ul>
    </div>
    <div class="swiper-state" v-if="pageState">
      <span>{{currIndex}}/{{allSwiper}}</span>
    </div>
  </div>
</template>

<script>
import Emitter from "../../utils/emitter";
import { findComponentsDownward } from "../../utils/findComponent";
import Icon from "../icon/Icon";
export default {
  name: "jeSwiper",
  components: {
    Icon
  },
  props: {
    // 默认的当前位置索引。0是第一个； defaultIndex:1 时，相当于从第2个开始执行
    defaultIndex: {
      type: Number,
      default: 1
    },
    //运行方向 可以是“水平”或“垂直” 默认(水平滑块)。
    direction: {
      type: Boolean,
      default: true // true 水平方向， false 垂直方向
    },
    //设置为true可使用鼠标滚轮模式
    mousewheel: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: String,
      default: 'hover',
      validator: val => ['hover','click'].indexOf(val) > -1
    },
    indicatorPosition: {
      type: String,
      default: 'inside',
      validator: val => ['inside','outside', 'card'].indexOf(val) > -1
    },
    arrow: {
      type: String,
      default: 'hover',
      validator: val => ['hover','always','never'].indexOf(val) > -1
    },
    //是否禁用高级效果以获得更好的性能。
    modes: {
      type: Boolean,
      default: false
    },
    //自动分页
    autoPage: {
      type: Boolean,
      default: true
    },
    //自动运行
    autoPlay: {
      type: Boolean,
      default: true
    },
    //分页状态对象，用于显示分页状态，例如：2/3
    pageState: {
      type: Boolean,
      default: false
    },
    //设置为true以启用连续循环模式
    loop: {
      type: Boolean,
      default: true
    },
    //毫秒；切换效果持续时间（一次切换效果执行所用的时间长度）
    delayTime: {
      type: Number,
      default: 500
    },
    //毫秒；自动运行间隔，相当于运行速度。
    interTime: {
      type: Number,
      default: 3500
    },
    touch: { // 允许触摸
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      totalWidth:0,
      continuous: true,
      allSwiper:0,
      swiperIndex: this.defaultIndex - 1,
      swiperList: [], 
      swiperNumber: [], 
      itemWidth: 0,
      speed: this.delayTime,
      hover: false,
      interval: null,
      hoverTime: null,
    }
  },
  mounted() {
    this.swiperList = findComponentsDownward(this, 'jeSwiperItem');
    this.allSwiper = this.swiperList.length
    this.$nextTick(() => {
      this.initSwiper()
      window.addEventListener('resize', this.initSwiper, false);
    })
  },
  methods: {
    initSwiper(){
      // 判断只有一个幻灯片的情况
      this.continuous = this.swiperList.length < 2 ? false : true;
      // 创建幻灯片数量
      this.swiperNumber = new Array(this.swiperList.length);
      this.itemWidth = Math.round(this.$el.getBoundingClientRect().width || this.$el.offsetWidth)
      this.totalWidth = this.swiperList.length * this.itemWidth + 'px'
      this.$nextTick(() => {
        this.setItemSwiper()
        this.start()
      })
    },
    setItemSwiper(){
      let len = this.swiperList.length;
      while (len--) {
        let slide = this.swiperList[len];
        slide.itemStyle = {
          width: this.itemWidth + 'px',
          left: len * -this.itemWidth + 'px'
        }
        this.move(len, this.swiperIndex > len ? -this.itemWidth : this.swiperIndex < len ? this.itemWidth : 0, 0);
      }
      // 重新定位索引之前和之后的元素
      if (this.continuous) {
        this.move(this.circle(this.swiperIndex - 1), -this.itemWidth, 0);
        this.move(this.circle(this.swiperIndex + 1), this.itemWidth, 0);
      }
    },
    start() {
      this.hover = false;
      if (this.autoPlay) {
        // this.stop()
        this.interval = setInterval(this.next, this.interTime);
      }
    },
    stop() {
      this.hover = true;
      clearTimeout(this.interval);
    },
    prev() {
      if (this.continuous) this.runSwiper(this.swiperIndex - 1);
      else if (this.swiperIndex) this.runSwiper(this.swiperIndex - 1);
    },
    next() {
      if (this.continuous) this.runSwiper(this.swiperIndex + 1);
      else if (this.swiperIndex < this.swiperList.length - 1) this.runSwiper(this.swiperIndex + 1);
    },
    
    circle(index) {
      let len = this.swiperList.length;
      return (len + (index % len)) % len;
    },
    move(index, dist, speed) {
      this.translate(index, dist, speed);
      this.swiperNumber[index] = dist;
    },
    translate(index, dist, speed) {
      let slide = this.swiperList[index].$el;
      slide.style.webkitTransitionDuration = slide.style.transitionDuration = `${speed}ms`;
      slide.style.webkitTransform = `translate(${dist}px,0) translateZ(0)`;
    },
    stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    touchStart(e) {},
    touchMove(e) {},
    touchEnd(e) {},
    runSwiper(toIndex, slideSpeed){
      if (this.swiperIndex == toIndex) return;
      let direction = Math.abs(this.swiperIndex - toIndex) / (this.swiperIndex - toIndex);
      // 获取幻灯片的实际位置
      if (this.continuous) {
        let natural = direction;
        direction = -this.swiperNumber[this.circle(toIndex)] / this.itemWidth;
        if (direction !== natural) {
          toIndex = -direction * this.swiperList.length + toIndex;
        } 
      }
      let diff = Math.abs(this.swiperIndex - toIndex) - 1;
      while (diff--) {
        this.move(
          this.circle((toIndex > this.swiperIndex ? toIndex : this.swiperIndex) - diff - 1),
          this.itemWidth * direction, 0
        );
      }

      toIndex = this.circle(toIndex);
      this.move(this.swiperIndex, this.itemWidth * direction, slideSpeed || this.speed);
      this.move(toIndex, 0, slideSpeed || this.speed);
      if (this.continuous){
        this.move(this.circle(toIndex - direction), -(this.itemWidth * direction), 0); 
      }
      this.$emit('change', toIndex, this.swiperIndex);
      this.swiperIndex = toIndex;
    },
    handleIndicatorClick(current){
      this.runSwiper(current);
    },
    handleIndicatorHover(current){
      if (this.trigger === 'hover' && current !== this.swiperIndex){
        clearTimeout(this.hoverTime);
        this.hoverTime = setTimeout(() => {
          this.runSwiper(current);
        },300)
      }
    }
  },
  computed: {
    pagePosition(){
      return [
        'swiper-page',
        this.indicatorPosition
      ]
    },
    currIndex(){
      return this.swiperIndex + 1
    },
    arrowDisplay() {
      return this.arrow !== 'never'
    },
  },
  destroyed () {
    this.stop()
    this.setItemSwiper()
    window.removeEventListener('resize', this.initSwiper, false);
  }
}
</script>