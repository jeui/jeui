<template>
  <div :class="progressClass">
    <div :class="['je-progress-bar',status]" v-if="type == 'line'">
      <div class="je-progress-tempo" :style="{height: strokeWidth + 'px'}">
        <span :style="barStyle"></span>
      </div>
      <div class="je-progress-text">
        <slot>{{content}}</slot>
      </div>
    </div>
    <div :class="circleClass" :style="circleWidthHeight" v-else>
      <svg viewBox="0 0 100 100">
        <path
          :d="pathString"
          stroke="#e5e9f2"
          :stroke-width="strokeWidth"
          :fill-opacity="0"
          :style="trailStyle"
        />
        <path
          :d="pathString"
          :stroke-linecap="strokeLinecap"
          :stroke="stroke"
          :stroke-width="strokeWidth"
          :fill-opacity="0"
          :style="pathStyle"
        />
      </svg>
      <div class="je-progress-text">
        <slot>{{content}}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "jeProgress",
  props: {
    type: {
      type: String,
      default: 'line',
      validator: val => ["line", "circle", "dashboard"].indexOf(val) > -1
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    },
    status: {
      type: String,
      default:"default",
      validator: val => ["default", "success", "exception", "warning"].indexOf(val) > -1 
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    circleSize: {
      type: Number,
      default: 120
    },
    color: {
      type: [String, Function],
      default: ""
    },
    // 'square', 'round'
    strokeLinecap: {
      type: String,
      validator(val) {
        return ["square", "round"].indexOf(val) > -1;
      },
      default: "round"
    },
    format: Function
  },
  data() {
    return {
    };
  },
  computed: {
    progressClass(){
      return [
        'je-progress',
        this.type !== 'line' ? 'je-progress-block':''
      ]
    },
    circleClass(){
      return [
        `je-progress-${this.type}`,
      ]
    },
    circleWidthHeight() {
      return {
        width: `${this.circleSize}px`,
        height: `${this.circleSize}px`
      };
    },
    barStyle() {
      const style = {};
      style.width = this.percentage + "%";
      style.backgroundColor = this.color;
      return style;
    },
    content() {
      if (typeof this.format === "function") {
        return this.format(this.percentage) || "";
      } else {
        return `${this.percentage}%`;
      }
    },
    stroke() {
      let reColor = '';
      if(this.color) {
        if (typeof this.color === 'function') {
          reColor = this.color(this.percentage);
        } else if (typeof this.color === 'string') {
          reColor = this.color;
        }
      } else {
        switch (this.status) {
          case 'success':
            reColor = '#13ce66';
            break;
          case 'exception':
            reColor = '#ff4949';
            break;
          case 'warning':
            reColor = '#e6a23c';
            break;
          default:
            reColor = '#20a0ff';
        }
      }
      return reColor;
    },
    radius() {
      return 50 - this.strokeWidth / 2;
    },
    circleLen() {
      return Math.PI * 2 * this.radius;
    },
    pathString() {
      if (this.type == 'dashboard') {
        return `M 50,50 m 0,${this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}`;
      }
      if (this.type == 'circle') {
        return `M 50,50 m 0,-${this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`;
      }
    },
    trailStyle() {
      let style = {};
      if (this.type == 'dashboard') {
        style = {
          "stroke-dasharray": `${this.circleLen - 75}px ${this.circleLen}px`,
          "stroke-dashoffset": `-${75 / 2}px`,
          transition:
            "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s"
        };
      }
      return style;
    },
    pathStyle() {
      let style = {};
      if (this.type == 'dashboard') {
        style = {
          "stroke-dasharray": `${(this.percentage / 100) * (this.circleLen - 75)}px ${this.circleLen}px`,
          "stroke-dashoffset": `-${75 / 2}px`,
          transition:
            "stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s"
        };
      } 
      if (this.type == 'circle') {
        style = {
          "stroke-dasharray": `${this.circleLen}px ${this.circleLen}px`,
          "stroke-dashoffset": `${((100 - this.percentage) / 100) * this.circleLen}px`,
          transition: "stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease"
        };
      }
      return style;
    }
  }
};
</script>
