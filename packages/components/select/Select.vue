<template>
  <div class="je-select" v-clickOutside="hideSelect">
    <div class="je-select-box" @click="toggleSelect" :style="{ width: width }" ref="select">
      <div :class="multipleClass" v-if="multiple">
        <div class="je-select-multiple-list">
          <em class="placeholder" v-if="multipleList.length == 0">{{placeholder}}</em>
          <template v-if="multipleList.length > 0">
            <span class="je-select-tags" v-for="(item, index) in multipleList" :key="index">
              {{ item.label }}
              <JeIcon v-if="!item.disabled"
                type="icon-normal-close"
                size="12px"
                @click.stop="closeTags(item)"
              />
            </span>
          </template>
        </div>
        <span>
        <JeIcon type="icon-movedown" class="je-c9" :class="arrowsClass" v-if="multiple" />
        </span>
      </div>

      <JeInput
        v-model="queryValue"
        v-if="!multiple"
        width="100%"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="selectReadonly"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.native="handleQueryChange"
        @paste.native="handleQueryChange"
      >
      <JeIcon type="icon-movedown" class="je-pr4 je-c9" :class="arrowsClass" slot="suffix" />
      </JeInput>
    </div>
    <transition name="jedrop">
      <div ref="main" :class="openClass" v-show="visible" :style="openStyle" @mouseenter="openHeight">
        <Scrollbar>
          <p class="je-select-item je-tc" v-if="loadFound">
            {{ emptyText }}
          </p>
          <template v-show="!loadFound">
            <slot></slot>
          </template>
        </Scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import Emitter from "../../utils/emitter";
import { setElementSize } from "../../utils/dom";
import {debounce} from "../../utils/util"
import clickOutside from "../../utils/clickoutside";
import { findComponentsDownward } from "../../utils/findComponent";
import Scrollbar from '../scrollbar/Scrollbar';
import JeIcon from "../icon/Icon";
import JeInput from "../input/Input";
// const selectPanels = [];
export default {
  name: "jeSelect",
  mixins: [Emitter],
  directives: { clickOutside },
  props: {
    value: {
      type: [String, Number, Array],
      default: ""
    },
    width: {
      type: String,
      default: "200px"
    },
    openWidth: String,
    size: {
      type: String,
      default: "small"
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ""
    },
    notText: {
      type: String,
      default: "暂无匹配数据"
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: "加载中..."
    },
    appendBody: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 9999
    },
    remote: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    remoteMethod: Function,
    filterMethod: Function
  },
  components: {
    Scrollbar,
    JeInput,
    JeIcon
  },
  provide() {
    return {
      'select': this
    };
  },
  data() {
    return {
      options: [],
      selectReadonly: this.readonly,
      focusIndex: 0,
      visible: false,
      loadFound: false,
      emptyText: "",
      openStyle: {},
      queryValue: "",
      modelValue: null,
      multipleList: [],
    };
  },
  watch: {
    value (vals) {
      this.modelValue = vals
      if (vals === "") {
        this.queryValue = ""
      }  
      this.dispatch("jeFormItem", "form-blur", [vals]);
    },
    queryValue(value) {
      if(this.remote) {
        if(value !== "") {
          this.$nextTick(() => this.setOpenStyle())
        }else {
          this.hideSelect();
        }
      }
    },
    loading(value) {
      if(!value && this.remote) {
        this.loadFound = false;
        this.handleQueryFilter(this.queryValue);
      }
    }
  },
  created(){
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '');
    }
    this.modelValue = this.multiple ? (this.value || []) : this.value;
  },
  mounted() {  
    if(this.filterable) {
      this.selectReadonly = false
    }
    document.addEventListener('keydown', this.handleKeydown)
    this.$nextTick(() => { 
      this.$nextTick(() => this.setValue())
      // 获取选中的值
      this.$on("on-select-selected", this.getValue);
      window.addEventListener("resize", this.setOpenStyle, false);
    })
  },
  methods: {
    getOption(){
      return findComponentsDownward(this, "jeOption"); 
    },
    toggleSelect() {
      if (!this.disabled) {
        this.visible ? this.hideSelect() : this.showSelect();
      }
    },
    showSelect(){
      this.visible = (this.remote && this.queryValue === '') ? false : true;
      this.$nextTick(() => {
        if(this.appendBody) {
          document.body.appendChild(this.$refs.main)
        }
        this.setOpenStyle()
      })
    },
    hideSelect(){
      this.visible = false;
      this.focusIndex = 0
      this.broadcast('jeOption', 'on-select-close')
    },
    setValue(){
      this.multipleList = []
      this.getOption().forEach((val,idx) => {
        if (this.multiple && this.modelValue.length > 0) {
          if(this.modelValue.indexOf(val.value) !== -1){
            this.multipleList.push(val)
            val.selected = true
          }else{
            val.selected = false
          }
        }else{
          if (val.value === this.modelValue) {
            this.queryValue = val.label;
          }
        }
      })
    },
    getValue(objs) {
      let changeValue = null
      let options = this.getOption();
      if (this.multiple) {
        this.multipleList = []
        if(this.modelValue.indexOf(objs.value) !== -1){
          this.modelValue = this.modelValue.filter(val => val !== objs.value)
        }else{
          this.modelValue.push(objs.value)
        }
        changeValue = []
        this.modelValue.forEach(val => {          
          options.forEach(item => {
            if(item.value === val){
              this.multipleList.push(item)
              changeValue.push({
                value: item.value ,
                label: item.label,
                rawdata: item.rawdata,
                selected: item.selected
              })
            }
          })         
        })
      }else{
        options.forEach(val => {
          val.selected = val.value === objs.value ? true : false;
        });
        this.queryValue = objs.label;
        this.modelValue = objs.value
        this.hideSelect()
        changeValue = objs
      }
      this.$emit("input", this.modelValue);
      this.$emit("change", changeValue);
      this.$nextTick(() => this.setOpenStyle())
    },
    closeTags(objs){
      if (!objs.disabled){
        this.modelValue = this.modelValue.filter(val => val !== objs.value)
        this.$nextTick(() => this.setValue())
        this.$emit("input", this.modelValue);
        this.$emit("remove-change",objs)
      }
    },
    handleBlur(event) {
      setTimeout(() => {
        this.$emit('blur', event);
      }, 50);
    },
    handleKeydown (evt) {
      if (this.visible) {
        const keyCode = evt.keyCode;
        if (keyCode === 27) { // escape
          evt.preventDefault()
          this.hideSelect()
        } else if (keyCode === 40) { // down arrow
          evt.preventDefault()
          this.navigateOptions('next')
        } else if (keyCode === 38) { // up arrow
          evt.preventDefault()
          this.navigateOptions('prev')
        } else if (keyCode === 13) { // enter
          evt.preventDefault()
          let hasFocus = false
          this.getOption().forEach(item => {
            if (item.isFocus) {
              hasFocus = true
              item.selectOpiton()
            }
          })
          if (!hasFocus) {
            this.selectFirstOption()
          }
        }
      }
    },
    navigateOptions(direction){
      let options = this.getOption()
      if (direction === 'next') {
        const next = this.focusIndex + 1
        this.focusIndex = (this.focusIndex === options.length) ? 1 : next
      } else if (direction === 'prev') {
        const prev = this.focusIndex - 1
        this.focusIndex = (this.focusIndex <= 1) ? options.length : prev
      }
      let isValid = false, hasValidOption = false 
      options.forEach((item, idx) => {
        if ((idx + 1) === this.focusIndex) {
          isValid = !item.disabled && item.showHide
          if (isValid) {
            item.isFocus = true
          }
        } else {
          item.isFocus = false
        }
        if (item.showHide && !item.disabled) {
          hasValidOption = true
        }
      })
      if (!isValid && hasValidOption) {
        this.navigateOptions(direction)
      }
    },
    selectFirstOption () {
      let firstOption
      this.getOption().forEach(item => {
        if (!firstOption && item.showHide) {
          firstOption = item
          item.selectOpiton()
        }
      })
    },
    setOpenStyle() {
      let style = setElementSize(this.$el, this.$refs.main);
      if (this.openWidth !== "") {
        style.width = this.openWidth || this.width;
      }    
      this.openStyle = Object.assign({ zIndex: this.zIndex }, style);
    },
    openHeight() {
      if(this.$refs.main.offsetHeight >= 226) {
        this.$set(this.openStyle,'height','226px')
      }
    },
    handleFocus(event) {
      if(this.filterable){
        this.visible = true;
      }
      this.$emit("focus", event);
    },
    handleQueryChange(evt){
      let keyCode = evt.keyCode, value = this.queryValue;
      if(keyCode === 13 || keyCode === 38 || keyCode === 40 ) return;
      if(value !== "" && this.remote) {
        this.loadFound = true;
        this.emptyText = this.loadingText;
        this.showSelect();
      };
      debounce(() => {
        let loadRemote = this.remote && typeof this.remoteMethod === 'function';
        if(this.remote && typeof this.remoteMethod === 'function') {
          this.remoteMethod(value);
        } else {
          if(this.filterable){     
            this.handleQueryFilter(value)
            this.filterMethod && this.filterMethod(value)
          }
        }       
      },this.remote ? 300 : 0)();
    },
    handleQueryRemote(value) {
      if(value === "" && this.remote) {
        this.hideSelect();
      }
    },
    handleQueryFilter(value) {
      let loadFound = true
      this.broadcast('jeOption', 'on-query-change', value)
      this.$nextTick(() => {
        if(value !== ''){
          this.getOption().forEach(item => {
            if (item.showHide) {
              loadFound = false
            }
          })
        }else{
          loadFound = false
        }    
        if(loadFound) {
          this.emptyText = this.notText
        }
        this.loadFound = loadFound
        this.broadcast('jeOptionGroup', 'on-group-change');
        this.$nextTick(() => this.setOpenStyle())
      })
    }
  },
  computed: {
    inputClass() {
      return ["je-select-input", this.size];
    },
    arrowsClass() {
      return [
        "je-select-arrows",
        {["openarrows"]:this.visible}
      ]
    },
    multipleClass(){
      return [
        "je-select-multiple",
        {
          ["focus"]: this.visible
        }
      ]
    },
    openClass() {
      return [
        "je-select-open",
        {
          ["multiple"]: this.multiple
        }
      ];
    }
  },
  beforeDestroy() {
    this.hideSelect();
    window.removeEventListener("resize", this.setOpenStyle, false);
  }
};
</script>
