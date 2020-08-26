// 记录所有的事件绑定
const eventList = [];

// 根据 html 代码片段创建 dom 对象
function createElemByHTML(html) {
  let div;
  div = document.createElement("div");
  div.innerHTML = html;
  return div.children;
}

// 是否是 DOM List
function isDOMList(selector) {
  if (!selector) {
    return false;
  }
  if (selector instanceof HTMLCollection || selector instanceof NodeList) {
    return true;
  }
  return false;
}

// 封装 document.querySelectorAll
function querySelectorAll(selector) {
  const result = document.querySelectorAll(selector);
  if (isDOMList(result)) {
    return result;
  } else {
    return [result];
  }
}

// 创建构造函数
function DomElement(selector) {
  if (!selector) {
    return;
  }

  // selector 本来就是 DomElement 对象，直接返回
  if (selector instanceof DomElement) {
    return selector;
  }

  this.selector = selector;
  const nodeType = selector.nodeType;

  // 根据 selector 得出的结果（如 DOM，DOM List）
  let selectorResult = [];
  if (nodeType === 9) {
    // document 节点
    selectorResult = [selector];
  } else if (nodeType === 1) {
    // 单个 DOM 节点
    selectorResult = [selector];
  } else if (isDOMList(selector) || selector instanceof Array) {
    // DOM List 或者数组
    selectorResult = selector;
  } else if (typeof selector === "string") {
    // 字符串
    selector = selector.replace("/\n/mg", "").trim();
    if (selector.indexOf("<") === 0) {
      // 如 <div>
      selectorResult = createElemByHTML(selector);
    } else {
      // 如 #id .class
      selectorResult = querySelectorAll(selector);
    }
  }

  const length = selectorResult.length;
  if (!length) {
    // 空数组
    return this;
  }

  // 加入 DOM 节点
  for (let i = 0; i < length; i++) {
    this[i] = selectorResult[i];
  }
  this.length = length;
}

// new 一个对象
function $(selector) {
  return new DomElement(selector);
}
$.isType = function(obj, type) {
  var firstUper = function(str) {
    str = str.toLowerCase();
    return str.replace(/\b(\w)|\s(\w)/g, function(m) {
      return m.toUpperCase();
    });
  };
  return (
    Object.prototype.toString.call(obj) == "[object " + firstUper(type) + "]"
  );
};
$.each = function(obj, fn) {
  if ($.isType(obj, "array")) {
    for (var i = 0, len = obj.length; i < len; i++) {
      if (fn.call(obj[i], obj[i], i) === false) {
        break;
      }
    }
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (fn.call(obj[key], obj[key], key) === false) {
          break;
        }
      }
    }
  }
};

// 修改原型
DomElement.prototype = {
  constructor: DomElement,
  // 类数组，each
  each(fn) {
    for (let i = 0; i < this.length; i++) {
      const elem = this[i];
      const result = fn.call(elem, elem, i);
      if (result === false) {
        break;
      }
    }
    return this;
  },

  // clone
  clone(deep) {
    const cloneList = [];
    this.each(elem => {
      cloneList.push(elem.cloneNode(!!deep));
    });
    return $(cloneList);
  },
  // 绑定事件
  on(type, selector, fn) {
    // selector 不为空，证明绑定事件要加代理
    if (!fn) {
      fn = selector;
      selector = null;
    }

    // type 是否有多个
    let types = [];
    types = type.split(/\s+/);

    return this.each(elem => {
      $.each(types, type => {
        if (!type) {
          return;
        }

        // 记录下，方便后面解绑
        eventList.push({
          elem: elem,
          type: type,
          fn: fn
        });

        if (!selector) {
          // 无代理
          elem.addEventListener(type, fn);
          return;
        }

        // 有代理
        elem.addEventListener(type, e => {
          const target = e.target;
          if (target.matches(selector)) {
            fn.call(target, e);
          }
        });
      });
    });
  },

  // 取消事件绑定
  off(type, fn) {
    return this.each(elem => {
      elem.removeEventListener(type, fn);
    });
  },

  // 获取/设置 属性
  attr(key, val) {
    if (val == null) {
      // 获取值
      return this[0].getAttribute(key);
    } else {
      // 设置值
      return this.each(elem => {
        elem.setAttribute(key, val);
      });
    }
  },

  // 添加 class
  addClass(className) {
    if (!className) {
      return this;
    }
    return this.each(elem => {
      let arr;
      if (elem.className) {
        // 解析当前 className 转换为数组
        arr = elem.className.split(/\s/);
        arr = arr.filter(item => {
          return !!item.trim();
        });
        // 添加 class
        if (arr.indexOf(className) < 0) {
          arr.push(className);
        }
        // 修改 elem.class
        elem.className = arr.join(" ");
      } else {
        elem.className = className;
      }
    });
  },

  // 删除 class
  removeClass(className) {
    if (!className) {
      return this;
    }
    return this.each(elem => {
      let arr;
      if (elem.className) {
        // 解析当前 className 转换为数组
        arr = elem.className.split(/\s/);
        arr = arr.filter(item => {
          item = item.trim();
          // 删除 class
          if (!item || item === className) {
            return false;
          }
          return true;
        });
        // 修改 elem.class
        elem.className = arr.join(" ");
      }
    });
  },

  // 修改 css
  css(value) {
    let cssNumber = {
        "column-count": 1,
        columns: 1,
        "box-flex": 1,
        "line-clamp": 1,
        "font-weight": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
      },
      toLower = function(str) {
        return str
          .replace(/::/g, "/")
          .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
          .replace(/([a-z\d])([A-Z])/g, "$1_$2")
          .replace(/_/g, "-")
          .toLowerCase();
      },
      addPx = function(name, val) {
        return typeof val == "number" && !cssNumber[toLower(name)]
          ? val + "px"
          : val;
      };

    if (typeof value === "string") {
      return (function(el, style) {
        let def = document.defaultView;
        style.indexOf("-") > -1 &&
          (style = style.replace(/-(\w)/g, function(m, a) {
            return a.toUpperCase();
          }));
        style == "float" && (style = def ? "cssFloat" : "styleFloat");
        return (
          el.style[style] ||
          (def
            ? window.getComputedStyle(el, null)[style]
            : el.currentStyle[style]) ||
          null
        );
      })(this[0], toLower(value));
    } else {
      return this.each(elem => {
        for (let v in value) {
          if (value.hasOwnProperty(v)) {
            elem.style[toLower(v)] = addPx(v, value[v]);
          }
        }
      });
    }
  },
  // 获取子节点（包括文本节点）
  children() {
    const elem = this[0];
    if (!elem) {
      return null;
    }
    return $(elem.childNodes);
  },
  eq: function(i) {
    if (this.length < 1) {
      return null;
    }
    return this[i] ? new DomElement(this[i]) : null;
  },
  first: function() {
    var list = this.children();
    return list.length > 0 ? list.eq(0) : null;
  },
  last: function() {
    var list = this.children();
    return list.length > 0 ? list.eq(list.length - 1) : null;
  },
  index: function() {
    if (this.length < 1) {
      return -1;
    }
    var i = -1,
      sibling = this[0];
    while (sibling) {
      i++;
      sibling = sibling.previousSibling;
    }
    return i;
  },

  // 是否包含某个子节点
  isContain($child) {
    const elem = this[0];
    const child = $child[0];
    return elem.contains(child);
  },
  // 尺寸数据
  getSize() {
    const elem = this[0];
    return elem.getBoundingClientRect(); // 可得到 bottom height left right top width 的数据
  },
  // 封装 nodeName
  getNodeName() {
    const elem = this[0];
    return elem.nodeName;
  },
  // 从当前元素查找
  find(selector) {
    const elem = this[0];
    return $(elem.querySelectorAll(selector));
  },
  // 获取当前元素的 text
  text(val) {
    let innText = document.all ? "innerText" : "textContent";
    if (!val) {
      const elem = this[0];
      return elem[innText];
    } else {
      return this.each(elem => {
        elem[innText] = val;
      });
    }
  },
  // 获取 html
  html(value) {
    if (value == null) {
      const elem = this[0];
      return elem.innerHTML;
    } else {
      return this.each(elem => {
        elem.innerHTML = value;
      });
    }
  },
  // 获取 value
  val(value) {
    if (value == null) {
      const elem = this[0];
      return elem.value.trim();
    } else {
      return this.each(elem => {
        elem.value = value;
      });
    }
  },
  files(value) {
    if (value == null) {
      const elem = this[0];
      return elem.files;
    } else {
      return this.each(elem => {
        elem.value = value;
      });
    }
  },
  // focus
  focus() {
    return this.each(elem => {
      elem.focus();
    });
  },
  // parent
  parent() {
    const elem = this[0];
    return $(elem.parentElement);
  },
  // 增加子节点
  append(node) {
    return this.each(elem => {
      $(node).each(child => {
        elem.appendChild(child);
      });
    });
  },
  // 移除当前节点
  remove() {
    return this.each(elem => {
      if (elem.remove) {
        elem.remove();
      } else {
        const parent = elem.parentElement;
        parent && parent.removeChild(elem);
      }
    });
  },
  // 将该元素插入到某个元素前面
  insertBefore(selector) {
    const $referenceNode = $(selector);
    const referenceNode = $referenceNode[0];
    if (!referenceNode) {
      return this;
    }
    return this.each(elem => {
      const parent = referenceNode.parentNode;
      parent.insertBefore(elem, referenceNode);
    });
  },

  // 将该元素插入到某个元素后面
  insertAfter(selector) {
    const $referenceNode = $(selector);
    const referenceNode = $referenceNode[0];
    if (!referenceNode) {
      return this;
    }
    return this.each(elem => {
      const parent = referenceNode.parentNode;
      if (parent.lastChild === referenceNode) {
        // 最后一个元素
        parent.appendChild(elem);
      } else {
        // 不是最后一个元素
        parent.insertBefore(elem, referenceNode.nextSibling);
      }
    });
  },
  prev: function() {
    if (this.length < 1) {
      return null;
    }
    var node = this[0].previousSibling;
    return node ? new DomElement(node) : null;
  },
  next: function() {
    if (this.length < 1) {
      return null;
    }
    var node = this[0].nextSibling;
    return node ? new DomElement(node) : null;
  },
  scan: function(fn, order) {
    if (this.length < 1) {
      return;
    }
    order = order === undefined ? true : order;
    function walk(node) {
      var n = order ? node.firstChild : node.lastChild;
      while (n) {
        var next = order ? n.nextSibling : n.previousSibling;
        if (fn(n) === false) {
          return false;
        }
        if (walk(n) === false) {
          return false;
        }
        n = next;
      }
    }
    walk(this[0]);
    return this;
  }
};

export default $;
