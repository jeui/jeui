import Vue from 'vue';
import jeMessage from './Message.vue'
import jeTipMmg from './TipMessage.vue'

let msgs = [], msgidx = 1, diff = 16,
  msgType = ['info', 'success', 'warning', 'error', 'loading'];
const instanceMessage = Vue.extend(jeMessage);
const instanceTipMmg = Vue.extend(jeTipMmg);


const Message = function (propsData) {
  propsData = propsData || {};
  let closeFunc = propsData.onClose,
    mid = `message-${msgidx++}`, topDist = 0;
  propsData.onClose = function () {
    Message.close(mid, closeFunc)
  }

  if (typeof propsData == 'string') {
    propsData = {
      message: propsData
    }
  }
  propsData.visible = true;
  const instance = new instanceMessage({propsData}).$mount();
  instance.msgid = mid;
  msgs.forEach(val => {
    topDist += val.$el.offsetHeight + diff;
  });

  topDist += diff;
  instance.top = topDist;
  msgs.push(instance);
  return instance
}

Message.close = function (id, closeFunc) {
  let len = msgs.length,
    index, delHeight;

  for (let i = 0; i < len; i++) {
    if (id === msgs[i].msgid) {
      if (typeof closeFunc === 'function') {
        closeFunc(msgs[i]);
      }
      index = i;
      delHeight = msgs[i].$el.offsetHeight;
      msgs.splice(i, 1);
      break
    }
  }

  if (len > 1) {
    for (let i = index; i < len - 1; i++) {
      msgs[i].$el.style.top = `${parseInt(msgs[i].$el.style.top) - delHeight - diff}px`
    }
  }
}

Message.closeAll = function () {
  msgs.forEach((elem) => {
    elem.close()
  })
}

msgType.forEach(type => {
  Message[type] = function (options, time) {
    if (typeof options === 'string') {
      options = {
        message: options,
        duration: time || 4
      }
    }
    options.type = type;
    options.icon = options.icon;
    return Message(options);
  }
})

Message.tips = function (propsData) {
  propsData = propsData || {};

  if (typeof propsData == 'string') {
    propsData = {
      message: propsData
    }
  }
  propsData.visible = true;
  const instance = new instanceTipMmg({
    propsData
  }).$mount();
  // 返回关闭方法，用于手动关闭
  return function () {
    instance.close(mid);
    return instance
  }
};

jeMessage.install = function (Vue) {
  Vue.prototype.$Message = Message
}

export default Message;
export { jeMessage };
