// https://github.com/singod/simple-scrollbar

let w = window, d = document;
let raf = w.requestAnimationFrame || w.setImmediate || function (c) { return setTimeout(c, 0); };

function initEl(el) {
  Object.defineProperty(el, 'data-scrollbar', { value: new Scrollbar(el), configurable: true });
}

function unbindEl(el) {
  if (!Object.prototype.hasOwnProperty.call(el, 'data-scrollbar')) return;
  el['data-scrollbar'].unBind();
  delete el['data-scrollbar'];
}

// Mouse drag handler
function dragDealer(el, context) {
  let lastPageY;
  el.addEventListener('mousedown', function (e) {
    lastPageY = e.pageY;
    el.classList.add('je-scroll-grabbed');
    d.body.classList.add('je-scroll-grabbed');
    d.addEventListener('mousemove', drag);
    d.addEventListener('mouseup', stop);
    return false;
  });

  function drag(e) {
    let delta = e.pageY - lastPageY;
    lastPageY = e.pageY;
    raf(function () {
      context.el.scrollTop += delta / context.scrollRatio;
    });
  }

  function stop() {
    el.classList.remove('je-scroll-grabbed');
    d.body.classList.remove('je-scroll-grabbed');
    d.removeEventListener('mousemove', drag);
    d.removeEventListener('mouseup', stop);
  }
}

// Constructor
function Scrollbar(el) {
  this.target = el;
  this.content = el.firstElementChild;
  this.direction = w.getComputedStyle(this.target).direction;
  this.bar = '<div class="je-scroll-bar">';
  
  this.wrapper = d.createElement('div');
  this.wrapper.setAttribute('class', 'je-scroll-wrapper');
  this.el = d.createElement('div');
  this.el.setAttribute('class', 'je-scroll-content');
  this.el.setAttribute('scrollcontent','')
  if (this.direction === 'rtl') {
    this.el.classList.add('rtl');
  }
  this.wrapper.appendChild(this.el);
  this.mB = this.moveBar.bind(this);
  while (this.target.firstChild) {
    this.el.appendChild(this.target.firstChild);
  }
  
  this.target.appendChild(this.wrapper);
  this.target.insertAdjacentHTML('beforeend', this.bar);
  this.bar = this.target.lastChild;

  dragDealer(this.bar, this);
  this.moveBar();
  w.addEventListener('resize', this.mB);
  this.el.addEventListener('scroll', this.mB);
  this.el.addEventListener('mouseenter', this.mB);
  this.target.classList.add('je-scroll-container');
  let css = w.getComputedStyle(el);
  if (css['height'] === '0px' && css['max-height'] !== '0px') {
    el.style.height = css['max-height'];
  }

  this.unBind = function () {
    w.removeEventListener('resize', this.mB);
    this.el.removeEventListener('scroll', this.mB);
    this.el.removeEventListener('mouseenter', this.mB);
    this.target.classList.remove('je-scroll-container');
    this.target.insertBefore(this.content, this.wrapper);
    this.target.removeChild(this.wrapper);
    this.target.removeChild(this.bar);
    this.bar = null; 
  }
}

Scrollbar.prototype = {
  moveBar: function (e) {
    let that = this, totalHeight = this.el.scrollHeight,
      ownHeight = this.el.clientHeight;
    let isRtl = that.direction === 'rtl';
    let right = isRtl ?
      (that.target.clientWidth - that.bar.clientWidth + 18) :
      (that.target.clientWidth - that.bar.clientWidth) * -1;
    this.scrollRatio = ownHeight / totalHeight;

    raf(function () {
      if (that.scrollRatio >= 1) {
        that.bar.classList.add('je-scroll-hidden')
      } else {
        that.bar.classList.remove('je-scroll-hidden')
        that.bar.style.cssText = 'height:' + Math.max(that.scrollRatio * 100, 10) + '%; top:' + (that.el.scrollTop / totalHeight) * 100 + '%;right:' + right + 'px;';
      }
    });
  }
}

function initAll() {
  let nodes = d.querySelectorAll('*[jeScroll]');
  for (let i = 0; i < nodes.length; i++) {
    initEl(nodes[i]);
  }
}

function unbindAll() {
  let nodes = d.querySelectorAll('.je-scroll-container');
  for (let i = 0; i < nodes.length; i++) {
    unbindEl(nodes[i]);
  }
}

Scrollbar.initEl = initEl;
Scrollbar.initAll = initAll;
Scrollbar.unbindEl = unbindEl;
Scrollbar.unbindAll = unbindAll;

export default Scrollbar
