let _vue = require("vue");
let _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
const rafThrottle = function rafThrottle(fn) {
  var locked = false;
  return function () {
    var _this = this;
    for (
      var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++
    ) {
      args[_key] = arguments[_key];
    }
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(function (_) {
      fn.apply(_this, args);
      locked = false;
    });
  };
}

const isFirefox = function isFirefox() {
  return (
    !!window.navigator.userAgent.match(/firefox/i)
  );
};

const debounce = function debounce(func, wait, immediate) {
  let timeout, result;
  const clear = function(){
    clearTimeout(timeout);
    timeout = null;
  };
  const debounced = function () {
    let context = this, args = arguments;
    if (timeout) clear();
    if (immediate) {
      // 如果已经执行过，不再执行
      let callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait)
      if (callNow) result = func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    }
    return result;
  };
  debounced.cancel = function () {
    clear();
  };
  return debounced;
}

const throttle = function throttle(func, wait, options) {
  let timeout, context, args, previous = 0;
  if (!options) options = {};

  const later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };
  const clear = function(){
    clearTimeout(timeout);
    timeout = null;
  };
  const throttled = function () {
    let now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clear();
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  throttled.cancel = function () {
    clear();
  };
  return throttled;
}

export {
  rafThrottle,
  isFirefox,
  debounce,
  throttle
};
