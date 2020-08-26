<template>
  <form class="je-form">
    <slot></slot>
  </form>
</template>

<script>
// 导入表单验证
import jeVerify from './jeVerify';
export default {
  name:"jeForm",
  props: {
    model: {
      type: Object
    },
    rules: {
      type: Object
    },
    labelWidth: {
      type: String
    },
    labelPosition: {
      type:String,
      validator(val){
        return ['left', 'center', 'right'].indexOf(val) > -1;
      },
      default: 'right'
    },
  },
  provide () {
    return { FormInstance : this };
  },
  data () {
    return {
      propFields: [],
      rawObjs: {}
    }
  },
  created () {
    this.$on('add-propfield', (field) => {
      if (field) this.propFields.push(field);
      return false;
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.rawObjs = this.keepModel()
    })
  },
  methods: {
    keepModel() {
      //扩展对象
      const extend = function () {
        //复制对象方法
        const cloneObj = function (oldObj) {      
          if (typeof oldObj != "object" || oldObj == null) return oldObj;
          let newObj = new Object();
          for (let i in oldObj){
            newObj[i] = cloneObj(oldObj[i]);
          } 
          return newObj;
        }
        let args = arguments;
        if (args.length < 2) return;
        let clone = cloneObj(args[0]);
        //调用复制对象方法
        for (let n = 1; n < args.length; n++) {
          for (let i in args[n]) {
            clone[i] = args[n][i];
          }
        }
        return clone;
      }
      return extend({},this.model);
    },
    resetFields(callback){
      return new window.Promise((resolve, reject) => {
        callback && callback(this.rawObjs);
        resolve(true);
      }).then(() => {
        this.$nextTick(() => {
          this.clearVerify(); 
        })
      })
    },
    clearVerify(){
      this.propFields.forEach((item) => {
        item.singleClear(item.prop);
      });
    },
    verify(callback){
      if(this.rules && this.propFields){
        let promise, valid = true, fieldObjs = {};

        this.propFields.forEach((item) => {
          fieldObjs[item.prop] = this.model[item.prop]
          item.singleVerify(item.prop)
        })
        
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function(val) {
              val ? resolve(val) : reject(val);
            };
          });
        }
        let res = {};
        if (this.propFields.length === 0) {
          valid = true;
        }else{
          let ruleObjs = {};
          Object.keys(fieldObjs).forEach(item => {
            ruleObjs[item] = this.rules[item]
          });

          res = new jeVerify(ruleObjs).validate(fieldObjs);
          valid = res.size === 0 ? true : false;
        }

        callback && callback(valid, res.fields);
        if (promise) {
          return promise;
        }
      }
    },
  }
}
</script>
