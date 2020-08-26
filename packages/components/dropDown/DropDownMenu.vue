<template>
  <transition name="je-dropdown">
    <div class="je-dropdown-content" ref="dropOpen" v-if="visible" @mouseenter="parents.handleMouseenter" @mouseleave="parents.handleMouseleave" :style="[{ width: width }, openStyle]">
      <dl>
        <slot></slot>
      </dl>
    </div>
  </transition>
</template>

<script>
  import Emitter from "../../utils/emitter";
  import {findParentComponent} from "../../utils/findComponent";
  export default {
    name: "jeDropDownMenu",
    mixins: [Emitter],
    props: {
      width: {
        type: String,
        default: "auto"
      }
    },
    data() {
      return {
        visible: false,
        openStyle: {},
        parents: findParentComponent(this,'jeDropDown')
      };
    },
    mounted() {  
      this.$on("menu-item-click", this.clickItem);
    },
    methods: {
      clickItem(command, instance) {
        if (!instance.isDisabled) {
          this.visible = false;
          this.dispatch(
            "jeDropDown",
            "drop-down-click",
            [command, instance]
          );
        }
        return
      },
      // 点击空白处或者弹层以外处关闭
      clickBlank() {
        let that = this;
        document.addEventListener(
          "mouseup",
          ev => {
            ev.stopPropagation();
            that.visible = false;
          },
          false
        );
        that.$el.addEventListener(
          "mouseup",
          function (ev) {
            ev.stopPropagation();
          },
          false
        );
      }
    }
  };

</script>
