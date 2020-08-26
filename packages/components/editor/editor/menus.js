// 编辑器菜单

import $ from "./dom.js";
import Dialog from "./dialog.js";
import Upload from "./upload";
// 表格
const pStr = "<p><br/></p>";
const createTable = function(rowNum, colNum) {
  let r, c;
  let html = '<table border="0" width="100%" cellpadding="0" cellspacing="0">';
  for (r = 0; r < rowNum; r++) {
    html += "<tr>";
    if (r === 0) {
      for (c = 0; c < colNum; c++) {
        html += "<th>&nbsp;</th>";
      }
    } else {
      for (c = 0; c < colNum; c++) {
        html += "<td>&nbsp;</td>";
      }
    }
    html += "</tr>";
  }
  html += "</table><p><br></p>";
  return html;
};
// 颜色
const Colors = [
  '#ffffff','#000000','#eeece1','#1f497d','#4f81bd','#c0504d','#9bbb59','#8064a2','#4bacc6','#f79646',
  '#f2f2f2','#979797','#ddd9c3','#c6d9f0','#dbe5f1','#f2dcdb','#ebf1dd','#e5e0ec','#dbeef3','#fdeada',
  '#d8d8d8','#595959','#c4bd97','#8db3e2','#b8cce4','#e5b9b7','#d7e3bc','#ccc1d9','#b7dde8','#fbd5b5',
  '#bfbfbf','#3f3f3f','#938953','#548dd4','#95b3d7','#d99694','#c3d69b','#b2a2c7','#92cddc','#fac08f',
  '#a5a5a5','#262626','#494429','#17365d','#366092','#953734','#76923c','#5f497a','#31859b','#e36c09',
  '#7f7f7f','#0c0c0c','#1d1b10','#0f243e','#244061','#632423','#4f6128','#3f3151','#205867','#974806',
  '#c00000','#ff0000','#ffc000','#ffff00','#92d050','#00b050','#00b0f0','#0070c0','#002060','#7030a0'
];
const resColor = (function() {
  let html = '<ul class="colors">';
  for (let c = 0; c < Colors.length; c++) {
    html += "<li style='background-color:"+Colors[c]+"' value='"+Colors[c]+"'></li>";
  }
  html += "</ul>";
  return html;
})();

// 各类菜单
const menus = {
  undo: {
    icon: '<span class="eiconsize eicon-undo"></span>',
    title: "撤回",
    callback() {
      this.execCom("undo")
    }
  },
  redo: {
    icon: '<span class="eiconsize eicon-redo"></span>',
    title: "重做",
    callback() {
      this.execCom("redo")
    }
  },
  removeformat: {
    icon: '<span class="eiconsize eicon-clear_formats"></span>',
    title: "清除样式",
    callback() {
      this.execCom("removeformat")
    }
  },
  underline: {
    icon: '<span class="eiconsize eicon-underline"></span>',
    title: "下划线",
    callback() {
      this.execCom("underline");
    }
  },
  bold: {
    icon: '<span class="eiconsize eicon-bold"></span>',
    title: "加粗",
    callback() {
      this.execCom("bold");
    }
  },
  italic: {
    icon: '<span class="eiconsize eicon-italic"></span>',
    title: "倾斜",
    callback() {
      this.execCom("italic")
    }
  },
  strikethrough: {
    icon: '<span class="eiconsize eicon-del_line"></span>',
    title: "删除线",
    callback() {
      this.execCom("strikeThrough");
    }
  },
  fontSize: {
    icon: '<span class="eiconsize eicon-size_add"></span>',
    title: "字体大小",
    callback() {
      this.execCom("fontSize", "14px")
    }
  },
  fontColor: {
    icon: '<span class="eiconsize eicon-font_color"></span>',
    title: "字体颜色",
    callback(bEl) {
      let that = this;
      new Dialog({
        title: "字体颜色",
        width: "240px",
        content: resColor,
        button: false,
        center: false,
        mounted(els){
          let t = this
          let rect = t.getElementSize(bEl[0]);
          t.setCss(t.wrap, {top:(rect.top + rect.height) + 'px', left:(rect.left) + 'px'})
          $(els).find('li').each((elem) => {
            t.addEvent(elem, "click", () => {
              that.execCom("ForeColor", $(elem).attr('value'));
              t.close(t.wrap)
            })
          })
        }
      });
    }
  },
  backcolor: {
    icon: '<span class="eiconsize eicon-bgcolor"></span>',
    title: "背景颜色",
    callback(bEl) {
      let that = this;
      new Dialog({
        title: "背景颜色",
        width: "240px",
        content: resColor,
        button: false,
        center: false,
        mounted(els){
          let t = this
          let rect = t.getElementSize(bEl[0]);
          t.setCss(t.wrap, {top:(rect.top + rect.height) + 'px', left:(rect.left) + 'px'})
          $(els).find('li').each((elem) => {
            t.addEvent(elem, "click", () => {
              that.execCom("BackColor", $(elem).attr('value'));
              t.close(t.wrap)
            })
          })
        }
      });
    }
  },
  quote: {
    icon: '<span class="eiconsize eicon-quote"></span>',
    title: "引用",
    callback() {
      let value = this.range.toString();
      if (value)
        this.execCom("insertHTML", `<blockquote>${value}</blockquote>` + pStr);
    }
  },
  code: {
    icon: '<span class="eiconsize eicon-code"></span>',
    title: "代码",
    callback() {
      let value = this.range.toString();
      if (value)
        this.execCom("insertHTML", `<pre><code>${value}</code></pre>` + pStr);
    }
  },
  insertorderedlist: {
    icon: '<span class="eiconsize eicon-numbeing"></span>',
    title: "有序列表",
    callback() {
      this.execCom("insertorderedlist")
    }
  },
  insertunorderedlist: {
    icon: '<span class="eiconsize eicon-bullet"></span>',
    title: "无序列表",
    callback() {
      this.execCom("insertunorderedlist")
    }
  },
  
  justifyleft: {
    icon: '<span class="eiconsize eicon-align_left"></span>',
    title: "左对齐",
    callback() {
      this.execCom("justifyleft")
    }
  },
  justifycenter: {
    icon: '<span class="eiconsize eicon-align_horiz"></span>',
    title: "居中对齐",
    callback() {
      this.execCom("justifycenter")
    }
  },
  justifyright: {
    icon: '<span class="eiconsize eicon-align_right"></span>',
    title: "右对齐",
    callback() {
      this.execCom("justifyright")
    }
  },
  line: {
    icon: '<span class="eiconsize eicon-seperatorline"></span>',
    title: "水平线",
    callback(){
      this.execCom("insertHTML", '<hr style="page-break-after:always;">' + pStr)
    }
  },
  link: {
    icon: '<span class="eiconsize eicon-link"></span>',
    title: "插入超链接",
    callback() {
      if (!that.range) {
        return;
      }
      let value = this.range.toString();
      new Dialog({
        elem: this.body[0],
        title: "插入链接",
        width: "300px",
        content: `
        <div class="jed-create"><div class="title">内容</div><input name="text" value="${value}" autofocus="true" autocomplete="off" class="input" placeholder="请输入内容"></div>
        <div class="jed-create"><div class="title">链接</div><input name="url" value="" autofocus="true" autocomplete="off" class="input" placeholder="请输入链接"></div>`,
        done(els) {
          let urlTxt = $(els)
            .find('input[name="text"]')
            .val();
          let urlVal = $(els)
            .find('input[name="url"]')
            .val();
          if (urlVal !== "")
            that.execCom(
              "insertHTML",
              `<a href="${urlVal}" title="${urlTxt}">${urlTxt}</a>`
            );
        }
      });
    }
  },
  unlink: {
    icon: '<span class="eiconsize eicon-unlink"></span>',
    title: "清除超链接",
    callback() {
      this.execCom("unlink")
    }
  },
  video: {
    icon: '<span class="eiconsize eicon-video"></span>',
    title: "插入视频",
    callback() {
      new Dialog({
        title: "插入视频",
        width: "400px",
        height: "200px",
        content: ""
      })
    }
  },
  image: {
    icon: '<span class="eiconsize eicon-picture"></span>',
    title: "插入图片",
    callback() {
      new Dialog({
        title: "插入图片",
        width: "400px",
        height: "200px",
        content: {
          "本地上传": `<div class="jed-create tab-box" style="display: flex;">
                        <div class="title">image</div>
                        <input type="file" name="fileUpload" class="upload"/>
                      </div>`,
          "URL": `<div class="jed-create tab-box">
                    <div class="title">URL</div>
                    <input name="imageUrl" value="" autofocus="true" autocomplete="off" class="input" style="flex:1;" placeholder="image URL" />
                  </div>`
        },
        //  ` <div class="jed-create">
        //     <div class="title">image</div>
        //     <input type="file" name="fileUpload" class="upload"/>
        //   </div>
        //   <div class="jed-create">
        //     <div class="title">URL</div>
        //       <input name="imageUrl" value="" autofocus="true" autocomplete="off" class="input" style="flex:1;" placeholder="image URL">
        //     </div>
        //   </div>`,
        done(els) {
          const inputfile = $(els)
            .find('input[name="fileUpload"]')
            .files();
          const imageUrl = $(els)
            .find('input[name="imageUrl"]')
            .val();
          if (imageUrl) {
            this.execCom("insertImage", imageUrl);
            return;
          }
          if (inputfile) {
            const upload = new Upload({
              action: "https://jsonplaceholder.typicode.com/posts/",
              multiple: true,
              load: res => {
                console.log("成功", res);
              },
              error: res => {
                console.log("报错", res);
              }
            });
            upload.uploadRequest(inputfile[0]);
            console.log(inputfile);
          }
        }
      });
      // const url = window.prompt("Enter the image URL");
      // if (url) that.execCom("insertImage", url);
    }
  },
  table: {
    icon: '<span class="eiconsize eicon-table"></span>',
    title: "插入表格",
    callback() {
      let that = this;
      new Dialog({
        title: "插入表格",
        width: "400px",
        height: "200px",
        content: `
        <div class="jed-create"><div class="title">行数</div><input name="rows" value="5" autofocus="true" autocomplete="off" class="input" type="number" placeholder="请输入行数"></div>
        <div class="jed-create"><div classs="title">列数</div><input name="columns" value="5" autofocus="true" autocomplete="off" class="input" type="number" placeholder="请输入列数"></div>`,
        done(els) {
          const rowNum = Number(
            $(els)
              .find('input[name="rows"]')
              .val()
          );
          const colNum = Number(
            $(els)
              .find('input[name="columns"]')
              .val()
          );
          if (rowNum > 0 && colNum > 0) {
            const table = createTable(rowNum, colNum);
            that.execCom("insertHTML", table);
          }
        }
      });
    }
  },
  copy: {
    icon: '<span class="eiconsize eicon-docs"></span>',
    title: "复制",
    callback() {
      this.execCom("copy")
    }
  },
  cut: {
    icon: '<span class="eiconsize eicon-cut"></span>',
    title: "剪切",
    callback() {
      this.execCom("cut")
    }
  },
  
};

export default menus;
