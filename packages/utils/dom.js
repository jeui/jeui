// 获取元素尺寸位置
const getElementSize = function(elem) {
  // 该方法是计算当前元素距离当前视口的距离，所以需要得到页面的滚动距离
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let scrollLeft =
    document.documentElement.scrollLeft || document.body.scrollLeft;
  if (typeof elem.offset !== "number") {
    //不同浏览器中，元素的默认位置不同。为了统一起见，需要新创建一个元素
    let temp = document.createElement("div");
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
  };
};
// 设置元素尺寸位置
const setElementSize = function(inputElem, openElem, direction) {
  let rect = getElementSize(inputElem),
    diff = 4,
    leftSize = rect.left,
    topSize = rect.bottom,
    elemWidth = openElem.offsetWidth,
    elemHeight = openElem.offsetHeight,
    //滚动条位置
    scrollArea = type => {
      type = type ? "scrollLeft" : "scrollTop";
      return document.body[type] | document.documentElement[type];
    },
    // 文档宽高尺寸
    winArea = type => {
      return document.documentElement[type ? "clientWidth" : "clientHeight"];
    };
  // 如果右侧超出边界
  if (leftSize + elemWidth > winArea(true)) {
    leftSize = leftSize - (elemWidth - rect.width);
  }
  // 如果底部超出边界
  if (topSize + elemHeight > winArea()) {
    topSize = rect.top > elemHeight ? rect.top - elemHeight - diff * 2 : winArea() - elemHeight - 1;
  }
  // 根据目标元素计算弹层位置
  // topSize = Math.max(topSize + scrollArea() + diff, 1);
  topSize = Math.max(topSize + diff, 1);
  return {
    width: rect.width + "px",
    top: topSize + "px",
    left: leftSize + "px"
  };
};

//绑定元素事件
const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      } else {
        return function(element, event, handler) {
          if (element && event && handler) {
            element.attachEvent("on" + event, handler);
          }
        };
      }
    };
  }
})();

//移除绑定事件
const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

const getScrollContainer = function getScrollContainer(el, vertical) {
  let parent = el;
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window;
    }
    if (isScroll(parent, vertical)) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return parent;
};

const isInContainer = function isInContainer(el, container) {
  if (!el || !container) return false;
  let elRect = el.getBoundingClientRect();
  let containerRect = void 0;
  if (
    [window, document, document.documentElement, null, undefined].includes(
      container
    )
  ) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  } else {
    containerRect = container.getBoundingClientRect();
  }
  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  );
};

export {
  getElementSize,
  setElementSize,
  on,
  off,
  getScrollContainer,
  isInContainer
};
