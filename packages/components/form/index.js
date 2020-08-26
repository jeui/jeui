import jeForm from './Form';
import jeFormItem from './FormItem';

jeForm.install = function(Vue){
  Vue.mixin({ 
    created () {
      let that =this, verify = that.$options.verify;
      if(verify && Object.keys(verify).length>0){
        Object.keys(verify).forEach(val => {
          that[val] = verify[val]
        })
      }
    } 
  });
}

export {
  jeForm,
  jeFormItem
};
