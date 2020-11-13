import Vue from 'vue';
import jeLayer from './Layer.vue';
let instance;
const instanceLayer = Vue.extend(jeLayer);
// 绑定window的history事件
window.addEventListener('popstate', () => {
  if (instance) {
    insatnce.value = false; 
    instance = null;
  }
});

const Layer = (options = {}) => {
  if (!instance) {
    instance = new instanceLayer().$mount();
  }
  options.value = true
  options.open = function() {console.log('wai open')}
  options.close = function() {console.log('wai close')}
  // 合并参数与实例
  Object.assign(instance, options);
  return new Promise((resolve, reject) => {
    // 保存两个回调，在action改变的时候执行
    resolve(instance);
    reject(instance);
  })
}
const createStatusDialog = function (type) {
  const statusIcons = {
    'info': {icon:'icon-hint',color:'info'},
    'success': {icon:'icon-check',color:'success'},
    'warning': {icon:'icon-roundwarn',color:'warning'},
    'error': {icon:'icon-close',color:'danger'}
  }
  return (content, title, options = {}) => {
    if (typeof content === 'object') {
      options = content
      content = options.content
      title = options.title || '对话框的标题'
    }
    options.button = [
      {name:"确定"}
    ]
    return Layer(Object.assign({
      title,
      content,
      titleIcon: `${statusIcons[type].icon} je-${statusIcons[type].color}`
    }, options))
  }
}
Layer.info = createStatusDialog('info')
Layer.success = createStatusDialog('success')
Layer.warning = createStatusDialog('warning')
Layer.error = createStatusDialog('error')
Layer.confirm = function(props = {}) {}

jeLayer.install = function(Vue){
  Vue.prototype.$Layer = Layer 
}

export default Layer;
export { jeLayer };
