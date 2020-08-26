// 深拷贝函数
const Merge = function () {
  let length = arguments.length, target = arguments[0] || {}, i = 1;
  if (typeof target != "object" && typeof target != "function") target = {};
  // if (length == 1) target = this; i--;
  for (let i = 1; i < length; i++) {
    let source = arguments[i];
    for (let key in source) {
      // 使用for in会遍历数组所有的可枚举属性，包括原型。
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

//返回日期
const DateTime = function (valObj = {}) {
  let that = this, newdate = new Date(), keys = Object.keys(valObj),
    narr = {YYYY:"FullYear", MM:"Month", DD:"Date", hh:"Hours", mm:"Minutes", ss:"Seconds"};
  let vb = Object.assign({
    YYYY: newdate.getFullYear(), MM: newdate.getMonth(), DD: newdate.getDate(),
    hh: newdate.getHours(), mm: newdate.getMinutes(), ss: newdate.getSeconds()
  }, valObj||{});
  let ND = keys.length === 0 ? newdate : new Date(vb.YYYY, vb.MM, vb.DD, vb.hh, vb.mm, vb.ss);
  if (keys.length > 0) {
    keys.forEach(function (v, i) {
      ND["set" + narr[v]](narr[v] == "Month" ? parseInt(vb[v]) - 1 : parseInt(vb[v]));
    });
  }
  //返回一个数值相同的新DateTime对象 
  that.reDate = function () {
    return new DateTime();
  };
  //返回此实例的Date值 
  that.GetValue = function () {
    return ND;
  };
  //获取此实例所表示日期的年份部分。 
  that.GetYear = function () {
    return ND.getFullYear();
  };
  //获取此实例所表示日期的月份部分。 
  that.GetMonth = function () {
    return ND.getMonth() + 1;
  };
  //获取此实例所表示的日期为该月中的第几天。 
  that.GetDate = function () {
    return ND.getDate();
  };
  //获取此实例所表示日期的小时部分。 
  that.GetHours = function () {
    return ND.getHours();
  };
  //获取此实例所表示日期的分钟部分。 
  that.GetMinutes = function () {
    return ND.getMinutes();
  };
  //获取此实例所表示日期的秒部分。 
  that.GetSeconds = function () {
    return ND.getSeconds();
  };
};


// 判断俩个对象是否相等
const ContrastObjs = function (valOne, valTwo) {
  let objOne = valOne instanceof Object,
    objTwo = valTwo instanceof Object;
  // 判断是不是对象
  if (!objOne || !objTwo) return valOne === valTwo;

  // 判断keys的长度是否相等
  if (Object.keys(valOne).length !== Object.keys(valTwo).length) return false;

  for (let k in valOne) {
    let vkOne = valOne[k] instanceof Object,
      vkTwo = valTwo[k] instanceof Object;
    if (vkOne && vkTwo) {
      return ContrastObjs(valOne[k], valTwo[k]);
    } else if (valOne[k] !== valTwo[k]) {
      return false;
    }
  }
  return true;
}

const StringMatch = function (str) {
  let smarr = [], maStr = "", parti = /(^\w{4}|\w{2}\B)/g;
  const isNum = function (value) {
    return /^[+-]?\d*\.?\d*$/.test(value) ? true : false;
  }
  if (str == '') return smarr;
  if (isNum(str)) {
    maStr = str.replace(parti, "$1-");
  } else {
    maStr = /^[A-Za-z]+$/.test(str) ? str.replace(parti, "$1-") : str;
  }
  maStr.match(/\w+|d+/g).forEach(val => {
    smarr.push(isNum(val) ? parseInt(val) : val);
  });
  return smarr;
}

// 为小于10 的数字补0
const Digit = function(val){
  return val < 10 ? "0" + (val | 0) : val;
}

//获取月与年
const GetYearMonth = function(y, m, n) {
  let ND = new Date(y, m - 1);
  ND.setMonth(m - 1 + n);
  return {
    YYYY: ND.getFullYear(),
    MM: ND.getMonth() + 1
  };
}
//获取上个月
const GetPrevMonth = function(y, m, n) {
  m = parseInt(m);
  return GetYearMonth(y, m, 0 - (n || 1));
}
//获取下个月
const GetNextMonth = function(y, m, n) {
  m = parseInt(m);
  return GetYearMonth(y, m, n || 1);
}

export {
  DateTime,
  Merge,
  ContrastObjs,
  StringMatch,
  Digit,
  GetYearMonth,
  GetPrevMonth,
  GetNextMonth
}
