const path = require('path');
const posixJoin = _path => path.posix.join('/', _path);

module.exports = {
  // 修改 src 为 examples
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: (config) => {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    config.resolve.extensions = ['.js', '.json', '.vue', '.css', 'less', '.scss'];
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.optimization.minimize(true);
  },
  productionSourceMap: false,
  // 强制内联CSS
  css: {
    extract: {
      filename: posixJoin(`css/jeui.css`),
      chunkFilename: posixJoin(`css/jeui.css`)
    },
    sourceMap: false,
    modules: false
  },
  // 第三方插件的选项
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './packages/style/variable.less')  // 引入全局样式变量
      ]
    }
  }
}
