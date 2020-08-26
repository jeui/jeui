import jeNotify from './Notify.vue'

jeNotify.install = function (Vue) {
  const Notify = Vue.extend(jeNotify);
  let VP = Vue.prototype, notarr = [], idx = 1, diff = 16,
    msgType = ['info', 'success', 'warning', 'error'];

  VP.$Notify = function(propsData) {
    propsData = propsData || {};
    propsData.visible = true;
    let closeFunc = propsData.onClose, mid = `notify-${idx++}`, topDist = 0;

    propsData.onClose = function() {
      VP.$Notify.close(mid, closeFunc)
    }

    if (typeof propsData == 'string') {
      propsData = {
        message: propsData
      }
    }

    const instance = new Notify({
      propsData
    }).$mount();

    instance.msgid = mid;
    notarr.forEach( val => {
      topDist += val.$el.offsetHeight + diff;
    });

    topDist += diff;
    instance.top = topDist;
    notarr.push(instance);

    // 返回关闭方法，用于手动关闭
    return function(){
      instance.close(mid)
    }
    
  }

  VP.$Notify.close = function(id, closeFunc){
    let len = notarr.length, index, delHeight;
  
    for (let i = 0; i < len; i++) {
      if (id === notarr[i].msgid) {
        if (typeof closeFunc === 'function') {
          closeFunc(notarr[i]);
        }
        index = i;
        delHeight = notarr[i].$el.offsetHeight;
        notarr.splice(i, 1);
        break
      }
    }
  
    if (len > 1) {
      for (let i = index; i < len - 1; i++) {
        notarr[i].$el.style.top = `${parseInt(notarr[i].$el.style.top) - delHeight - diff}px`
      }
    }
  }
  
  VP.$Notify.closeAll = function() {
    notarr.forEach((elem) => {
      elem.close()
    })
  }

  msgType.forEach(type => {
    VP.$Notify[type] = function(options) {
      if (typeof options === 'string') {
        options = {
          message: options
        }
      }
      options.type = type;
      return VP.$Notify(options);
    }
  })

}

export { jeNotify };
