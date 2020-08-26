class Dialog {
  constructor(options) {
    this.opt = Object.assign(
      {
        title: "标题",
        width: "100%",
        height: "auto",
        content: "",
        center: true,
        button: true,
        mounted: () => {},
        done: () => {},
        error: () => {}
      },
      options
    );
    this.initDialog();
  }
  initDialog() {
    const wrapDiv = document.createElement("div");
    wrapDiv.className = this.opt.center ? "je-editor-dialog center" : "je-editor-dialog";
    wrapDiv.style.width = this.opt.width;
    wrapDiv.style.height = this.opt.height;

    const titleDiv = document.createElement("div");
    titleDiv.className = "dialog-header";
    titleDiv.innerHTML = `<span>${this.opt.title}</span><em class="eiconsize eicon-close"></em>`;

    const bodyDiv = document.createElement("div");
    bodyDiv.className = "dialog-body";
    // 判断content是不是数组
    if (Object.prototype.toString.call(this.opt.content) == '[object Object]') {
      const bodyTab = document.createElement("div"); // 切换tabs
      const tabContent = document.createElement("div"); // 切换content
      let tabHtml = '', tabContentH = '';
      bodyTab.className = "dialog-tabs";
      Object.keys(this.opt.content).forEach((tabKey, index) => {
        if (!index) {
          tabHtml = `<span class="dialog-tab active">${tabKey}</span>`;
        } else {
          tabHtml += `<span class="dialog-tab">${tabKey}</span>`;
        }
        tabContentH += this.opt.content[tabKey];
      })
      bodyTab.innerHTML = tabHtml;
      tabContent.innerHTML = tabContentH;
      this.appendChild(bodyDiv, bodyTab);
      this.appendChild(bodyDiv, tabContent);
      const tabList = bodyTab.getElementsByClassName("dialog-tab"),
            tabConList = bodyDiv.getElementsByClassName("jed-create");
      for(let i = 0; i < tabList.length; i++) {
        let item = tabList[i]
        item.index = i
        item.onclick = function() {
          for(let i = 0; i < tabList.length; i++) {tabList[i].className = "dialog-tab";}
          for(let i = 0; i < tabConList.length; i++) {tabConList[i].style.display = "none";}
          tabList[this.index].classList = "dialog-tab active";
          tabConList[this.index].style.display = "flex";
        }
      }
    } else {
      bodyDiv.innerHTML = this.opt.content;
    }

    const butDiv = document.createElement("div");
    butDiv.className = "dialog-footer";
    butDiv.innerHTML = `<button class="yes">确定</button><button class="no">取消</button>`;

    this.wrap = wrapDiv;
    this.appendChild(wrapDiv, titleDiv);
    this.appendChild(wrapDiv, bodyDiv);
    if(this.opt.button) {
      this.appendChild(wrapDiv, butDiv);
    }
    this.appendChild(document.body, wrapDiv);
    this.show(wrapDiv);
    this.addEvent(titleDiv.querySelector("em"), "click", () => {
      this.close(wrapDiv);
    });
    this.opt.mounted && this.opt.mounted.call(this, bodyDiv);
    if(this.opt.button) {
      this.addEvent(butDiv.querySelector(".yes"), "click", () => {
        this.opt.done && this.opt.done.call(this, bodyDiv);
        this.close(wrapDiv);
      });
      this.addEvent(butDiv.querySelector(".no"), "click", () => {
        this.close(wrapDiv);
      });
    }
  }
  show(elem) {
    this.setCss(elem, { display: "block" });
  }
  close(elem) {
    elem.remove();
  }
  setCss(elem, objs) {
    for (var item in objs) {
      elem.style[item] = objs[item];
    }
  }
  addEvent(elem, type, listener) {
    elem.addEventListener(type, listener);
  }
  appendChild(elem, child) {
    elem.appendChild(child);
    return elem;
  }
  getElementSize(elem) {
    // 该方法是计算当前元素距离当前视口的距离，所以需要得到页面的滚动距离
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    if (typeof elem.offset !== 'number') {
      //不同浏览器中，元素的默认位置不同。为了统一起见，需要新创建一个元素
      let temp = document.createElement('div');
      temp.style.cssText = "position:absolute;top:0;left:0;opacity: 0;";
      document.body.appendChild(temp);
      elem.offset = -temp.getBoundingClientRect().top - scrollTop;
      document.body.removeChild(temp);
      temp = null;
    }
    let rect = elem.getBoundingClientRect(), 
      offset = elem.offset;
    return {
      width: rect.width,
      height: rect.height,
      left: rect.left + offset,
      right: rect.right + offset,
      top: rect.top + offset,
      bottom: rect.bottom + offset
    }
  }
}

export default Dialog;
