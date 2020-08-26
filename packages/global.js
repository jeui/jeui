
const gatherIndexJS = require.context(
  //找到components文件夹下index.js的文件
  './components', true, /\index.js$/
)

const components = {}
//查询目录下index.js的文件
gatherIndexJS.keys().forEach(fileName => {
  let list = gatherIndexJS(fileName);
  for (var val in list) {
    components[val] = list[val]
  }
});
delete components.default

export default components
