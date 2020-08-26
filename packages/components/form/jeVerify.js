// 第一个字母大写
const upperCase = function(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (S) => S.toUpperCase());
};
// 判断数据类型
const isType = function (val, type) {
  return Object.prototype.toString.call(val) === ("[object " + upperCase(type) + "]");
}
// type类型
const commonType = {
  // 整数
  Integer(value) {
    return (value !== "" && value != null && isType(value ,'number') && (value % 1 === 0)) ? true : false;
  },
  // 浮点数
  Float(value) {
    return (value !== "" && value != null && value != parseInt(value)) ? true : false;
  },
  // 是否为数字
  Number(value) {
    return (value !== "" && value != null && !isNaN(value)) ? true : false;
  },
  // 是否为数组
  Array(value) {
    return (isType(value ,'array') && value.length > 0) ? true : false;
  },
  // 是否为对象
  Object(value) {
    return (isType(value ,'object') && Object.keys(value).length > 0) ? true : false;
  }
};
// 表单验证控件
export default class jeVerify {
  constructor(rules) {
    this.rules = rules
    this.currRule = []
  }
  validate(obj) {
    let that = this, arrs = [],objs = {}, rule = that.rules;
    for (let key in obj) {
      let fieldRules = rule[key],
        currVal = obj[key];
      if (fieldRules) {
        if (!isType(fieldRules, 'array')) {
          throw `${fieldRules} rule formatting error`
        }
        let obj = that.single(currVal, fieldRules);
        if (!obj.valid && objs.message !== "") {
          arrs.push({
            field: key,
            message: obj.message,
            valid: obj.valid
          })
          objs[key] = {
            message: obj.message,
            valid: obj.valid
          }
        }
      }
    }
    return {size: arrs.length, fields: objs}
  }
  single(value,rules = []) {   
    let objs = {message: '',valid: true}, errorMsg = 'failed validation', 
      rule = rules.length>0 ? rules : this.rules;
    if (!isType(rule, 'array')) {
      throw `${rule} rule formatting error`
    }

    for (let i = 0; i < rule.length; i++) {
      let item = rule[i], type = 'String';
      if ('type' in item) {
        type = upperCase(item.type)
      }
      if(type !== 'String' && commonType[type](value) == false){
        if (item.message) {
          errorMsg = item.message;
        }
        objs = {message: errorMsg, valid: false}
        break;
      }
      if ('required' in item) {
        if (item.required && String(value) == '') {
          if (item.message) {
            errorMsg = item.message;
          }
          objs = {message: errorMsg, valid: false}
          break;
        }
      } 
      if ('validator' in item) {
        let regex = item.validator, valid = true;
        if(isType(regex,'function')){
          const callback = (err) => {return err}
          valid = regex && regex(item, value, callback)
        }else{
          if (regex instanceof RegExp) {
            valid = new RegExp(regex).test(value)
          }
        }
        if (valid === false) {
          if (item.message) {
            errorMsg = item.message;
          } 
          objs = {message: errorMsg, valid: valid}
          break;
        }
      }
      if ('min' in item) {
        if (value.length < item.min) {
          if (item.message) {
            errorMsg = item.message;
          }
          objs = {message: errorMsg, valid: false}
          break;
        }
      }
      if ('max' in item) {
        if (value.length > item.max) {
          if (item.message) {
            errorMsg = item.message;
          }
          objs = {message: errorMsg, valid: false}
          break;
        }
      }
    }
    return objs
  }
}
