const CountUp = function (startVal, endVal, decimals, duration, options) {
  var self = this;
  self.version = function () { return '1.9.3'; }; // 设置版本，没什么卵用
  // 默认的配置项
  self.options = {
    useEasing: true, // 是否使用缓动动画，默认为缓动，可以设置为false让其匀速
    useGrouping: true, // 对数字进行分组，如12345，按三位一组变为类似123,45这样的
    separator: ',', // 分组时使用的分隔符默认是逗号，
    decimal: '.', // 小数点
    easingFn: easeOutExpo, // 缓动动画的函数
    formattingFn: formatNumber, // 格式化数字如12345，格式化为123，45
    prefix: '', // 添加前缀如12345，变为￥12345
    suffix: '', // 添加后缀如12345 通过添加后缀变为12345$，12345元之类的
    numerals: [] // 用来做替换操作，一般用不到，默认为空就是不用他
  };
  // 通过传递的options更改默认的值
  if (options && typeof options === 'object') {
    for (var key in self.options) {
      if (options.hasOwnProperty(key) && options[key] !== null) {
        self.options[key] = options[key];
      }
    }
  }
  // 不需要将如12345转换为123,45,可以传递options{separator : ''}
  if (self.options.separator === '') {
    self.options.useGrouping = false;
  }
  else {
    // ensure the separator is a string (formatNumber assumes this)
    self.options.separator = '' + self.options.separator; // 使用对应的分隔符来格式化数字
  }
  // 针对不同的浏览器做requestAnimationFrame的兼容，通过添加前缀的方式，如果添加前缀也不支持就通过定时器来写
  var lastTime = 0;
  var vendors = ['webkit', 'moz', 'ms', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
  // 用来格式化数字，如将12345.32格式化为123,45.32,其原理是通过将数字分割为整数部分和小数部分，然后再进行字符串的拼接。
  function formatNumber(num) {
    var neg = (num < 0), // 用于判断正负数，如果是负数前面需要加-
      x, x1, x2, x3, i, len;
    num = Math.abs(num).toFixed(self.decimals);
    num += '';
    x = num.split('.');
    x1 = x[0]; // 整数部分
    x2 = x.length > 1 ? self.options.decimal + x[1] : ''; // 小数部分

    if (self.options.useGrouping) { // 进行格式化，每三位加逗号
      x3 = '';
      for (i = 0, len = x1.length; i < len; ++i) {
        if (i !== 0 && ((i % 3) === 0)) {
          x3 = self.options.separator + x3;
        }
        x3 = x1[len - i - 1] + x3;
      }
      x1 = x3;
    }
    // optional numeral substitution 这部分没什么卵用
    if (self.options.numerals.length) {
      x1 = x1.replace(/[0-9]/g, function (w) {
        return self.options.numerals[+w];
      })
      x2 = x2.replace(/[0-9]/g, function (w) {
        return self.options.numerals[+w];
      })
    }
    return (neg ? '-' : '') + self.options.prefix + x1 + x2 + self.options.suffix; // 可以添加前缀和后缀比如123通过加前缀变为￥123或者123元之类的
  }

  /***  
      缓动动画函数，参数：
      t: 动画执行到当前帧所经历的时间
      b: begining 起始值
      c: change 需要变化的量
      d: duration 动画的总时间
      
  ***/
  function easeOutExpo(t, b, c, d) {
    // console.log(c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b)
    return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
  }
  // 确保传递的是数字，如果不是数字会出现异常
  function ensureNumber(n) {
    return (typeof n === 'number' && !isNaN(n));
  }
  // 初始化操作
  self.initialize = function () {
    if (self.initialized) return true;

    self.startVal = Number(startVal);
    self.endVal = Number(endVal);
    // error checks
    if (ensureNumber(self.startVal) && ensureNumber(self.endVal)) {

      self.decimals = Math.max(0, decimals || 0); // 小数位数

      self.dec = Math.pow(10, self.decimals);
      self.duration = Number(duration) * 1000 || 2000; // 动画持续的时间
      self.countDown = (self.startVal > self.endVal); // 是向上动画还是向下动画
      self.frameVal = self.startVal; // 动画时刻更新的值，默认是从起始值开始的
      self.initialized = true;
      return true;
    }
    else {
      self.error = '[CountUp] startVal (' + startVal + ') or endVal (' + endVal + ') is not a number';
      return false;
    }
  };

  // 浏览器上面最终呈现的效果
  self.printValue = function (value) {
    var result = self.options.formattingFn(value);
    return result
  };
  // 最核心的部分，通过缓动动画计算出一个差值，当调用requestAnimateFrame
  // 的时候会将这个值设置到目标对象的innerHTML中
  self.count = function (timestamp) {

    if (!self.startTime) { self.startTime = timestamp; }

    self.timestamp = timestamp;
    var progress = timestamp - self.startTime;
    self.remaining = self.duration - progress;
    // to ease or not to ease
    // 使用缓动动画
    if (self.options.useEasing) {
      if (self.countDown) {
        self.frameVal = self.startVal - self.options.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
      } else {
        /***
            progress: 动画执行到当前帧所经历的时间
            self.startVal: begining 起始值
            self.endVal - self.startVal: change 需要变化的量
            self.duration: duration 动画的总时间
            
        ***/
        self.frameVal = self.options.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
        // console.log(self.frameVal)
      }
    } else {
      if (self.countDown) {
        self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
      } else {
        self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
      }
    }

    // don't go past endVal since progress can exceed duration in the last frame
    if (self.countDown) {
      self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
    } else {
      self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
      console.log(self.frameVal)
    }

    // decimal
    // self.frameVal = Math.round(self.frameVal*self.dec)/self.dec;

    // format and print value
    var result = self.printValue(self.frameVal);

    // whether to continue
    if (progress < self.duration) {
      self.rAF = requestAnimationFrame(self.count);
    }

    if (self.callback) self.callback(result);
  };
  // start开始动画
  self.start = function (callback) {
    if (!self.initialize()) return;
    self.callback = callback;
    self.rAF = requestAnimationFrame(self.count);
  };

}

export default CountUp
