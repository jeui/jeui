<template>
  <div :class="itemClass" :key="value" @click.stop="selectOpiton" 
  @mouseout.stop="blur" v-if="showHide">
    <div class="je-show je-boxflex"><slot>{{ currentLabel }}</slot></div>
    <JeIcon type="icon-draw" class="select-item-arrows"/>
  </div>
</template>

<script>
  import Emitter from '../../utils/emitter'
  import {findParentComponent} from "../../utils/findComponent";
  import JeIcon from "../icon/Icon";
  export default {
    name: "jeOption",
    mixins: [Emitter],
    inject: ['select'],
    props: {
      value: {
        type: [String, Number, Object],
        required: true
      },
      label: {
        type: [String, Number]
      },
      rawdata: [String, Number, Object],
      disabled: {
        type: Boolean,
        default: false
      }
    },
    components: {
      JeIcon
    },
    data(){
      return {
        selected:false,
        isFocus:false,
        showHide: true,
        searchLabel: ''
      }
    },
    mounted(){ 
      let select = findParentComponent(this,"jeSelect");
      this.searchLabel = this.label ? this.label : this.value;
      this.setCurrValue(select);
      this.$on('on-select-close', () => {
        this.isFocus = false
      })
      this.$on("on-query-change", val => {
        this.queryChange(val)
      })
    },
    methods: {
      selectOpiton(){
        if (!this.disabled){  
          this.selected = !this.selected
          this.dispatch("jeSelect", "on-select-selected", {
            value: this.value ? this.value : this.label,
            label: this.label ? this.label : this.value,
            rawdata: this.rawdata ? this.rawdata : "",
            selected: this.selected
          })
        }
      },
      blur () {
        this.isFocus = false
      },
      setCurrValue(obj){
        if(Array.isArray(obj.value) && obj.value.length > 0){
          if(obj.value.indexOf(this.value) !== -1){
            this.selected = true
          }
        }else {
          if(this.value === obj.value){
            this.selected = true
          }
        }
      },
      queryChange (val) {
        const query = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1')
        this.showHide = new RegExp(query, 'i').test(this.searchLabel)
      }
    },
    computed: {
      currentLabel() {
        let isObject = Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
        return this.label ? this.label : (isObject ? "" : this.value);
      },
      itemClass(){
        return [
          "je-select-item","je-flex","je-align-center",
          {
            ["option-active"]:this.selected,
            ["option-disabled"]:this.disabled,
            ["option-focus"]:this.isFocus,
          }
        ]
      }
    }
  }
</script>
