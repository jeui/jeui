// 导入样式
import '../packages/style/index.less';
// 导入组件
import componentList from '../packages/global.js';

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, opts = {}) {
  // 判断是否可以安装
  if (install.installed) return
  // 设置图片组件全局错误图片
  if (opts.errorImage) {
    componentList['jeImage'].props.errorHtml.default = opts.errorImage
  }
  // 遍历注册全局组件
  Object.keys(componentList).forEach(key => {
    let comps = componentList[key];
    // 判断是否有install方法，如果有就执行
    comps.install && comps.install(Vue);
    Vue.component(key, comps);
  });
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  ...componentList
}
