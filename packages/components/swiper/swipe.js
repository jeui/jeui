  
/*
 * Swiper 2.0.0
 * MIT License
 */
const Swiper = function (container, options) {
  let offloadFn = function (fn) {
    setTimeout(fn || (() => {}), 0);
  }; 

  // 检查浏览器支持状态
  let browser = {
    addEventListener: !!window.addEventListener,
    touch: 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch),
    transitions: (function (temp) {
      let props = [
        'transitionProperty',
        'WebkitTransition',
        'MozTransition',
        'OTransition',
        'msTransition'
      ];
      for (let i in props){
        if (temp.style[props[i]] !== undefined) return true;
      }   
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  let element = container.children[0], slides, slidePos, width, length;
  options = options || {};
  let index = parseInt(options.startSlide, 10) || 0;
  let speed = options.speed || 300;
  let widthOfSiblingSlidePreview = parseInt(options.widthOfSiblingSlidePreview, 10) || 0;
  let continuous = (options.continuous = options.continuous !== undefined ? options.continuous : true);

  const startSlide = function () {
    slides = element.children;
    length = slides.length;
    // 判断只有一个幻灯片的情况
    continuous = slides.length < 2 ? false : options.continuous;
    // 创建幻灯片数量
    slidePos = new Array(slides.length);
    // 确定每张幻灯片的宽度
    width =
      Math.round(
        container.getBoundingClientRect().width || container.offsetWidth
      ) - widthOfSiblingSlidePreview * 2;

    element.style.width = slides.length * width + 'px';

    let pos = slides.length;
    while (pos--) {
      let slide = slides[pos];
      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);
      if (browser.transitions) {
        slide.style.left = pos * -width + widthOfSiblingSlidePreview + 'px';
        move(pos, index > pos ? -width : index < pos ? width : 0, 0);
      }
    }

    // 重新定位索引之前和之后的元素
    if (continuous && browser.transitions) {
      move(circle(index - 1), -width, 0);
      move(circle(index + 1), width, 0);
    }

    if (!browser.transitions){
      element.style.left = index * -width + widthOfSiblingSlidePreview + 'px';
    }
    
    container.style.visibility = 'visible';
  }

  function prev() {
    if (continuous) slide(index - 1);
    else if (index) slide(index - 1);
  }

  function next() {
    if (continuous) slide(index + 1);
    else if (index < slides.length - 1) slide(index + 1);
  }

  function circle(index) {
    return (slides.length + (index % slides.length)) % slides.length;
  }

  function slide(to, slideSpeed) {
    if (index == to) return;
    if (browser.transitions) {
      let direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

      // 获取幻灯片的实际位置
      if (continuous) {
        let natural_direction = direction;
        direction = -slidePos[circle(to)] / width;
        if (direction !== natural_direction){
          to = -direction * slides.length + to;
        } 
      }
      let diff = Math.abs(index - to) - 1;
      while (diff--)
        move(
          circle((to > index ? to : index) - diff - 1),
          width * direction,
          0
        );

      to = circle(to);
      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);
      if (continuous){
        move(circle(to - direction), -(width * direction), 0); 
      } 
    } else {
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {
    translate(index, dist, speed);
    slidePos[index] = dist;
  }

  function translate(index, dist, speed) {
    let slide = slides[index], style = slide && slide.style;
    if (!style) return;
    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
  }

  function animate(from, to, speed) {
    // 如果不是动画，就重新定位
    if (!speed) {
      element.style.left = to + 'px';
      return;
    }
    let start = +new Date();
    let timer = setInterval(function () {
      let timeElap = +new Date() - start;
      if (timeElap > speed) {
        element.style.left = to + 'px';
        if (delay) begin();
        options.transitionEnd &&
          options.transitionEnd.call(event, index, slides[index]);
        clearInterval(timer);
        return;
      }
      element.style.left = (to - from) * (Math.floor((timeElap / speed) * 100) / 100) + from + 'px';
    }, 5);
  }

  // 幻灯片延迟时间
  let delay = options.auto || 0, interval;

  function begin() {
    clearTimeout(interval);
    interval = setTimeout(next, delay);
  }

  function stop() {
    delay = options.auto || 0;
    clearTimeout(interval);
  }

  let start = {}, delta = {}, isScrolling;

  // 设置事件捕获
  let events = {
    handleEvent(event) {
      switch (event.type) {
        case 'touchstart':
          this.start(event);
          break;
        case 'touchmove':
          this.move(event);
          break;
        case 'touchend':
          offloadFn(this.end(event));
          break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend':
          offloadFn(this.transitionEnd(event));
          break;
        case 'resize':
          offloadFn(startSlide);
          break;
      }
      if (options.stopPropagation){
        event.stopPropagation();
      } 
    },
    start(event) {
      let touches = event.touches[0];

      // 配置默认开始值
      start = {
        x: touches.pageX,
        y: touches.pageY,
        time: +new Date()
      };

      // 用于测试滚动事件
      isScrolling = undefined;
      delta = {};

      // 监听 touchmove 和 touchend 事件
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);
    },
    move(event) {
      if (event.touches.length > 1 || (event.scale && event.scale !== 1)) return;
      if (options.disableScroll) return;
      let touches = event.touches[0];
      // 设置x和y的变化
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      };

      if (typeof isScrolling == 'undefined') {
        isScrolling = !!(
          isScrolling || Math.abs(delta.x) < Math.abs(delta.y)
        );
      }

      // 如果用户不试图垂直滚动
      if (!isScrolling) {
        event.preventDefault();
        stop();

        // 第一次或最后一次滑动时增加阻力
        if (continuous) {
          translate( circle(index - 1), delta.x + slidePos[circle(index - 1)], 0 );
          translate(index, delta.x + slidePos[index], 0);
          translate( circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
        } else {
          delta.x = delta.x / ((!index && delta.x > 0) || 
              (index == slides.length - 1 && delta.x < 0) ?
              Math.abs(delta.x) / width + 1 : 1); 

          translate(index - 1, delta.x + slidePos[index - 1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index + 1, delta.x + slidePos[index + 1], 0);
        }
        options.swiping && options.swiping(-delta.x / width);
      }
    },
    end(event) {
      let duration = +new Date() - start.time;
      // 判断幻灯片是否触发下一个/上一个幻灯片
      let isValidSlide = (Number(duration) < 250 && // 如果幻灯片持续时间小于250ms
        Math.abs(delta.x) > 20) || Math.abs(delta.x) > width / 2; 
      let isPastBounds = (!index && delta.x > 0) || (index == slides.length - 1 && delta.x < 0); 
      if (continuous) isPastBounds = false;
      // determine direction of swipe (true:right, false:left)
      let direction = delta.x < 0;

      // 如果不是垂直滚动
      if (!isScrolling) {
        if (isValidSlide && !isPastBounds) {
          if (direction) {
            if (continuous) {
              // 我们需要在这个方向上做好下一个
              move(circle(index - 1), -width, 0);
              move(circle(index + 2), width, 0);
            } else {
              move(index - 1, -width, 0);
            }

            move(index, slidePos[index] - width, speed);
            move( circle(index + 1), slidePos[circle(index + 1)] - width, speed );
            index = circle(index + 1);
          } else {
            if (continuous) {
              // 我们需要在这个方向上做好下一个
              move(circle(index + 1), width, 0);
              move(circle(index - 2), -width, 0);
            } else {
              move(index + 1, width, 0);
            }

            move(index, slidePos[index] + width, speed);
            move( circle(index - 1), slidePos[circle(index - 1)] + width, speed );
            index = circle(index - 1);
          }

          options.callback && options.callback(index, slides[index]);
        } else {
          if (continuous) {
            move(circle(index - 1), -width, speed);
            move(index, 0, speed);
            move(circle(index + 1), width, speed);
          } else {
            move(index - 1, -width, speed);
            move(index, 0, speed);
            move(index + 1, width, speed);
          }
        }
      }

      // 移除touchmove和touchend事件监听，直到touchstart再次调用
      element.removeEventListener('touchmove', events, false);
      element.removeEventListener('touchend', events, false);
      element.removeEventListener('touchforcechange', function () {}, false);
    },
    transitionEnd: function (event) {
      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        if (delay) begin();
        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
      }
    }
  };

  startSlide();

  // 如果适用，启动自动幻灯片
  if (delay) begin();

  // 添加事件监听
  if (browser.addEventListener) {
    // 在元素上设置touchstart事件
    if (browser.touch) {
      element.addEventListener('touchstart', events, false);
      element.addEventListener('touchforcechange', function () {}, false);
    }

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    window.addEventListener('resize', events, false);
  } else {
    // 兼容IE
    window.onresize = function () {
      startSlide();
    }; 
  }

  // expose the Swipe API
  return {
    setup(){
      startSlide();
    },
    slide(to, speed){
      stop();
      slide(to, speed);
    },
    // 上一张幻灯片
    prev(){
      stop();
      prev();
    },
    // 下一张幻灯片
    next(){
      stop();
      next();
    },
    // 取消幻灯片
    stop(){
      stop();
    },
    // 返回当前索引位置
    getPos(){
      return index;
    },
    // 返回幻灯片总数
    getNumSlides(){
      return length;
    },
    kill(){
      stop();
      element.style.width = '';
      element.style.left = '';

      // 重置幻灯片
      let pos = slides.length;
      while (pos--) {
        let slide = slides[pos];
        slide.style.width = '';
        slide.style.left = '';
        if (browser.transitions) translate(pos, 0, 0);
      }

      // 删除事件监听
      if (browser.addEventListener) {
        // 删除当前事件监听
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);
      } else {
        window.onresize = null;
      }
    }
  };
};

export default Swiper