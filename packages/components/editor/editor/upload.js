class Upload {
  constructor(options) {
    this.upIndex = 1;
    this.initUpload(options);
  }
  initUpload(options) {
    let config = {
      action: options.action, //上传路径
      headers: {},
      data: {},
      fileName: "file", // 上传的文件字段名
      accept: "image/*", // 接受上传的文件类型
      limit: 5, // 最大允许上传个数
      multiple: false, // 是否支持多选文件
      autoUpload: true, // 是否在选取文件后立即进行上传
      withCredentials: true
    };
    this.tempList = [];
    this.xhr = null;
    this.reqs = {};
    this.opt = Object.assign({}, config, options);
    this.createUpload();
  }
  createUpload() {
    this.Input = document.createElement("input");
    this.Input.type = this.opt.fileName;
    this.Input.name = "file";
    if (this.opt.multiple) this.Input.setAttribute("multiple", "multiple");
    if (this.opt.accept) this.Input.setAttribute("accept", this.opt.accept);
    this.Input.onchange = ev => {
      const files = ev.target.files;
      this.opt.change && this.opt.change();
      this.uploadFiles(files);
    };
  }
  removeInput() {
    this.Input.remove();
    this.createUpload();
  }
  onDrop(e) {
    this.dragOver = false;
    if (this.disabled) return;
    this.opt.change && this.opt.change();
    this.uploadFiles(e.dataTransfer.files);
  }
  uploadFiles(files) {
    let that = this;
    // 文件超出个数限制
    if (that.limit && that.tempList.length + files.length > that.limit) {
      that.opt.exceed && that.opt.exceed(files, that.tempList);
      return;
    }
    let allFiles = Array.prototype.slice.call(files);
    if (that.opt.multiple) {
      allFiles.forEach((file, idx) => {
        that.addFiles(file, idx);
      });
    } else {
      let file = allFiles.slice(0, 1);
      that.addFiles(file, 0);
    }
    if (allFiles.length > 0 && that.opt.autoUpload) {
      setTimeout(() => {
        that.start();
      }, 10);
    }
  }
  addFiles(files, idx) {
    let that = this;
    files.uid = "UID" + new Date().getTime() + that.upIndex++;
    const _file = {
      status: "uploading",
      name: files.name,
      size: files.size,
      percentage: 0,
      base64: "",
      uid: files.uid,
      showProgress: true,
      file: files
    };
    that.tempList.push(_file);
    that.base64File(files, idx);
  }
  start() {
    let that = this;
    that.tempList.forEach(vals => {
      that.uploadRequest(vals.file);
    });
  }
  getFile(file) {
    const fileList = this.tempList;
    let target;
    fileList.every(item => {
      target = file.uid === item.uid ? item : null;
      return !target;
    });
    return target;
  }
  uploadRequest(files) {
    let formData = new FormData(),
      opts = this.opt;
    this.xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");
    this.reqs[files.uid] = this.xhr;
    const _file = this.getFile(files);
    const getBody = function(xhr) {
      const text = xhr.responseText || xhr.response;
      if (!text) return text;
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    };
    if (opts.data) {
      for (let key in opts.data) {
        formData.append(key, opts.data[key]);
      }
    }
    formData.append(files, opts.fileName);
    this.xhr.onload = opts.load.bind(this);
    this.xhr.onerror = opts.error.bind(this);
    if (this.xhr.upload) {
      this.xhr.upload.onprogress = e => {
        if (e.total > 0) e.percent = (e.loaded / e.total) * 100;
        opts.progress && opts.progress.call(this, e, _file);
      };
    }
    this.xhr.open("POST", opts.action, true);
    // 添加请求凭证, 在 ajax 跨域请求中携带 cookie 做身份认证
    if (opts.withCredentials) {
      this.xhr.withCredentials = true;
    }
    //添加监听
    this.xhr.onreadystatechange = () => {
      // readyState属性表示请求/响应过程的当前活动阶段，4为完成，已经接收到全部响应数据
      if (this.xhr.readyState == 4) {
        let status = this.xhr.status,
          once = false;
        // status：响应的HTTP状态码，以2开头的都是成功
        if ((status >= 200 && status < 300) || status == 0) {
          // 成功回调函数
          opts.success &&
            opts.success.call(this, {
              body: getBody(this.xhr),
              status,
              file: _file
            });
          once = true;
          delete this.reqs[files.uid];
          //全部完毕
        } else {
          opts.error && opts.error.call(this, { status, file: _file });
          delete this.reqs[files.uid];
        }
        if (once)
          opts.complete && opts.error.call(this, { status, file: _file });
      }
    };
    //设置请求头
    const headers = opts.headers;
    this.xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    for (let item in headers) {
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        this.xhr.setRequestHeader(item, headers[item]);
      }
    }
    //发送请求
    this.xhr.send(formData);
    return this;
  }
  // 转图片转为base64，可在图片没上传完前先显示图片
  base64File(imgFile, index) {
    const that = this;
    if (/image\/\w+/.test(imgFile.type)) {
      // alert('请确保文件为图像类型')
      const reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = function(event) {
        that.tempList[index].base64 = event.target.result;
      };
    }
  }
  abort(file) {
    const { reqs } = this;
    if (file) {
      let uid = file;
      if (file.uid) uid = file.uid;
      if (reqs[uid]) {
        reqs[uid].abort();
      }
    } else {
      Object.keys(reqs).forEach(uid => {
        if (reqs[uid]) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      });
    }
  }
  before(callback) {
    if (!callback) {
      return this;
    }
    this.opt.before = callback;
    return this;
  }
  change(callback) {
    if (!callback) {
      return this;
    }
    this.opt.change = callback;
    return this;
  }
  load(callback) {
    this.opt.load = response => {
      this.removeInput();
      if (callback) {
        callback(response);
      }
    };
    return this;
  }
  progress(callback) {
    this.opt.progress = response => {
      this.removeInput();
      if (callback) {
        callback(response);
      }
    };
    return this;
  }
  success(callback) {
    this.opt.success = response => {
      this.removeInput();
      if (callback) {
        callback(response);
      }
    };
    return this;
  }
  error(callback) {
    this.opt.error = response => {
      this.removeInput();
      if (callback) {
        callback(response);
      }
    };
    return this;
  }
  complete(callback) {
    this.opt.complete = response => {
      if (callback) {
        callback(response);
      }
    };
    return this;
  }
  enable() {
    this.Input.setAttribute("disabled", false);
    this.Input.style.cursor = "pointer";
  }
  disable() {
    this.Input.setAttribute("disabled", true);
    this.Input.style.cursor = "not-allowed";
  }
}
export default Upload;
