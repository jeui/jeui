import Vue from 'vue';
import jeNotify from './Notify.vue'

let notes = [], noteidx = 1, diff = 16,
  msgType = ['info', 'success', 'warning', 'error'];

const instanceNotify = Vue.extend(jeNotify);

const Notify = function (propsData) {
  propsData = propsData || {};
  let closeFunc = propsData.onClose,
  mid = `notify-${noteidx++}`, topDist = 0;

  propsData.onClose = function() {
    Notify.close(mid, closeFunc)
  }
  if (typeof propsData == 'string') {
    propsData = {
      message: propsData
    }
  }
  propsData.visible = true;
  const instance = new instanceNotify({propsData}).$mount();
  instance.msgid = mid;

  notes.forEach(val => {
    topDist += val.$el.offsetHeight + diff;
  });

  topDist += diff;
  instance.top = topDist;
  notes.push(instance);
  return instance
}

Notify.close = function (id, closeFunc) {
  let len = notes.length, index, delHeight;
  
  for (let i = 0; i < len; i++) {
    if (id === notes[i].msgid) {
      if (typeof closeFunc === 'function') {
        closeFunc(notes[i]);
      }
      index = i;
      delHeight = notes[i].$el.offsetHeight;
      notes.splice(i, 1);
      break
    }
  }

  if (len > 1) {
    for (let i = index; i < len - 1; i++) {
      notes[i].$el.style.top = `${parseInt(notes[i].$el.style.top) - delHeight - diff}px`
    }
  }
}

Notify.closeAll = function () {
  notes.forEach((elem) => {
    elem.close()
  })
}

msgType.forEach(type => {
  Notify[type] = function (options, time) {
    if (typeof options === 'string') {
      options = {
        message: options,
        duration: time || 4
      }
    }
    options.type = type;
    options.icon = options.icon;
    return Notify(options);
  }
})

jeNotify.install = function (Vue) {
  Vue.prototype.$Notify = Notify
}

export default Notify;
export { jeNotify };
