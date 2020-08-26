
export default function uploadAjax(opts) {
  let formData = new FormData()
  let xhr = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHTTP')
  const getBody = function(xhr) {
    const text = xhr.responseText || xhr.response
    if (!text) return text

    try {
      return JSON.parse(text)
    } catch (e) {
      return text
    }
  }
  if (opts.data) {
    for (let key in opts.data) {
      formData.append(key, opts.data[key])
    }
  }

  formData.append(opts.fileName, opts.file)
  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) e.percent = (e.loaded / e.total) * 100
      opts.onProgress && opts.onProgress(e)
    }
  }
  xhr.open('POST', opts.action, true)
  // 添加请求凭证, 在 ajax 跨域请求中携带 cookie 做身份认证
  if (opts.withCredentials) {
    xhr.withCredentials = true
  }

  //添加监听
  xhr.onreadystatechange = function() {
    // readyState属性表示请求/响应过程的当前活动阶段，4为完成，已经接收到全部响应数据
    if (xhr.readyState == 4) {
      var status = xhr.status
      // status：响应的HTTP状态码，以2开头的都是成功
      if ((status >= 200 && status < 300) || status == 0) {
        // 成功回调函数
        opts.onSuccess && opts.onSuccess(getBody(xhr))
        //全部完毕
      } else {
        opts.onError && opts.onError(status)
      }
    }
  }
  //设置请求头
  const headers = opts.headers
  for (let item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }
  //发送请求
  xhr.send(formData)
  return xhr
}
