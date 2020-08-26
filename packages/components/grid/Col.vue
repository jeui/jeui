<template>
  <div :class="gridClass" :style="gridStyles">
    <slot></slot>
  </div>
</template>

<script>
import { findComponentUpward } from '../../utils/findComponent'
const prefixCls = 'je-col'
export default {
  name: 'jeCol',
  props: {
    span: [Number, String],
    offset: [Number, String],
    push: [Number, String],
    pull: [Number, String],
    className: String,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },
  data () {
      return {
          gutter: 0
      };
  },
  computed: {
    gridClass() {
      let classList = [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.span}`]: this.span,
          [`${prefixCls}-offset-${this.offset}`]: this.offset,
          [`${prefixCls}-push-${this.push}`]: this.push,
          [`${prefixCls}-pull-${this.pull}`]: this.pull,
          [`${this.className}`]: !!this.className
        }
      ];

      ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
          if (typeof this[size] === 'number') {
            classList.push(`${prefixCls}-${size}-${this[size]}`);
          } else if (typeof this[size] === 'object') {
            let props = this[size];
            Object.keys(props).forEach(prop => {
              classList.push(
                prop !== 'span'
                  ? `${prefixCls}-${size}-${prop}-${props[prop]}`
                  : `${prefixCls}-${size}-${props[prop]}`
              );
            });
          }
      });

      return classList;
    },
    gridStyles() {
      let style = {};
      if (this.gutter !== 0) {
        style = {
          paddingLeft: this.gutter / 2 + 'px',
          paddingRight: this.gutter / 2 + 'px'
        };
      }
      return style;
    }
  },
  methods: {
    updateGutter () {
      const Row = findComponentUpward(this, 'jeRow');
      if (Row) {
        Row.updateGutter(Row.gutter);
      }
    }
  },
  mounted () {
    this.updateGutter();
  },
  beforeDestroy () {
    this.updateGutter();
  }
}
</script>
