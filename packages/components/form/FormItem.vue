<template>
  <div class="je-form-item">
    <label :class="labelClass" :style="labelStyle" v-if="label && label !== ''">{{label}}</label>
    <div class="je-form-item-content">
      <slot></slot>
      <div class="je-form-item-msg" v-if="valid">{{formMsg}}</div>
    </div>
  </div>
</template>

<script>
import Emitter from '../../utils/emitter';
import jeVerify from './jeVerify';
export default {
  name:"jeFormItem",
  mixins: [ Emitter ],
  props: {
    label:{
      type:String,
      default:""
    },
    prop:{
      type:String,
      default:""
    },
    rules:{
      type:[String,Array],
      default:() => []
    },
    labelWidth:{
      type:String,
      default:""
    },
    textPosition:{
      type:String,
      validator(val){
        return ['top', 'center', 'bottom'].indexOf(val) > -1;
      },
      default:"center"
    },
    labelPosition:{
      type:String,
      validator(val){
        return ['left', 'center', 'right'].indexOf(val) > -1;
      },
      default:"right"
    },
    showMessage:{
      type:Boolean,
      default:true
    },
  },
  inject: ['FormInstance'],
  data () {
    return {
      formMsg: '',
      valid: false,
      required: true,
      regex: true,
      max: false,
      min: false
    }
  },
  mounted () {
    this.dispatch('jeForm', 'add-allfield', this);
    if (this.prop && this.prop !== "") {
      if(this.rules && this.rules.length > 0){
        this.$set(this.FormInstance.rules,this.prop,this.rules)
      }
      this.dispatch('jeForm', 'add-propfield', this);
      this.$off('form-blur', () => this.singleVerify(this.prop));
      this.$off('form-change', () => this.singleVerify(this.prop));
      this.$on('form-blur', () => this.singleVerify(this.prop));
      this.$on('form-change', () => this.singleVerify(this.prop));
    }
  },
  methods: {
    singleVerify (prop) {
      this.formModel = this.FormInstance.model;
      this.formRules = this.FormInstance.rules;
      if(this.formModel && this.formRules && prop !== ""){
        let rules = (this.rules && this.rules.length > 0) ? this.rules : this.formRules[prop]
        let obj = new jeVerify(rules).single(this.formModel[prop])
        if(!obj.valid && this.showMessage){
          this.formMsg = obj.message
        }
        this.valid = !obj.valid
      }
    },
    singleClear(prop) {
      if(this.prop && this.prop === prop) {
        this.formMsg = '';
        this.valid = false;
      }
    }
  },
  computed: {
    labelStyle(){
      let labelWidth = this.labelWidth ? this.labelWidth : this.FormInstance.labelWidth
      return {
        width: labelWidth || '80px'
      }
    },
    labelClass(){
      const text = {
        top: 'left',
        center:'center', 
        bottom:'right'
      }
      return [
        "je-form-item-label",
        `je-align-${text[this.textPosition]}`,
        `je-justify-${this.labelPosition}`,
        {
          "je-form-item-required": this.prop !== ""
        }
      ]
    }
  }
}
</script>
