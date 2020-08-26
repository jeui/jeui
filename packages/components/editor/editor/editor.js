/*
 * @Author: guojun.chen
 * @Date: 2019-12-15 15:59:21
 * @Last Modified time: 2019-12-16 14:08:42
 */
// https://github.com/jaredreich/pell/blob/master/src/pell.js
import $ from "./dom.js";
import Dialog from "./dialog.js";
import Menus from "./menus.js";
const defaultSeparatorString = "defaultParagraphSeparator";
const formatBlock = "formatBlock";
const pStr = "<p><br/></p>";
const defaultClass = {
  wrap: "je-editor",
  actionbar: "je-editor-tools",
  button: "editor-btn",
  body: "je-editor-body",
  content: "editor-content",
  selected: "button-selected"
};

class JEditor {
  constructor(options) {
    this.opt = Object.assign(
      {
        elem: null,
        width: "100%",
        height: "200px",
        content: "",
        menu: Menus,
        onChange: val => {}
      },
      options
    );
    this.range = null;
    this.initEditor();
  }
  initEditor() {
    const actions = this.opt.actions
      ? this.opt.actions.map(action => {
          if (typeof action === "string") {
            return this.opt.menu[action];
          } else if (this.opt.menu[action.name]) {
            return {
              ...this.opt.menu[action.name],
              ...action
            };
          }
          return action;
        })
      : Object.keys(this.opt.menu).map(action => this.opt.menu[action]);

    const classes = {
      ...defaultClass,
      ...this.opt.class
    };

    const defaultSeparator = this.opt[defaultSeparatorString] || "div";

    this.wrap = $(`<div class="${classes.wrap}"></div>`);
    this.head = $(`<div class="${classes.actionbar}"></div>`);
    this.body = $(`<div class="${classes.body}"></div>`);
    this.body.css({ width: this.opt.width, height: this.opt.height ,contentEditable:`${true}`});
    this.content = $(
      `<div class="${classes.content}" contentEditable="${true}"></div>`
    );
    // this.content.css({width:'100%', minHeight: this.opt.height });
    this.content.on("input", e => {
      let firstChild = e.target.firstChild;
      if (firstChild && firstChild.nodeType === 3) {
        this.execCom(formatBlock, `<${defaultSeparator}>`);
      } else if (!this.content.html()) {
        this.content.html(pStr);
      }
      this.opt.onChange(this.content.html());
    });

    this.content.on("keydown", event => {
      if (
        event.key === "Enter" &&
        this.commandValue(formatBlock) === "blockquote"
      ) {
        setTimeout(() => {
          this.inputHandle();
          this.execCom(formatBlock, `<${defaultSeparator}>`);
        }, 0);
      }
    });

    let htmlCon =
      this.opt.content.substr(0, 3) !== "<p>"
        ? `<p>${this.opt.content}</p>`
        : this.opt.content;
    this.content.html(this.opt.content === "" ? pStr : htmlCon);
    this.content.on("paste", e => {
      document.execCommand("paste", e, true);
    });

    this.wrap.append(this.head).append(this.body.append(this.content));
    $(this.opt.elem).append(this.wrap);

    actions.forEach(action => {
      const bEl = $(
        `<button class="${classes.button}" type="button" title="${action.title}">${action.icon}</button>`
      );
      bEl.on("click", () => {
        action.callback && action.callback.call(this, bEl) && content.focus();
      });
      this.head.append(bEl);
    });

    $(document).on("mouseup", e => {
      this.saveRange();
    });
    this.content.on("keyup", e => {
      this.saveRange();
    });

    this.execCom(defaultSeparatorString, defaultSeparator);
    return this.opt.elem;
  }
  execCom(command, value = null) {
    if (this.range !== null) {
      this.restoreRange();
    }
    document.execCommand("styleWithCSS", false);
    if (
      (!!window.ActiveXObject || "ActiveXObject" in window) &&
      command === "insertHTML"
    ) {
      document.selection.createRange().pasteHTML(value);
    } else {
      document.execCommand(command, false, value);
    }
  }
  commandState(command) {
    document.queryCommandState(command);
  }
  commandValue(command) {
    document.queryCommandValue(command);
  }
  saveRange() {
    const selection = window.getSelection
      ? window.getSelection()
      : document.getSelection();
    const conEl = this.content;
    if (!selection.rangeCount || !conEl) {
      return;
    }
    for (let i = 0; i < selection.rangeCount; i++) {
      const range = selection.getRangeAt(0);
      let start = range.startContainer;
      let end = range.endContainer;
      start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start;
      end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end;
      if (conEl.isContain($(start)) && conEl.isContain($(end))) {
        this.range = range;
        break;
      }
    }
  }
  restoreRange() {
    const selection = window.getSelection
      ? window.getSelection()
      : document.getSelection();
    selection.removeAllRanges();
    selection.addRange(this.range);
  }
  getNode(el) {
    while (el.nodeType !== 1) {
      el = el.parentNode;
    }
    return el;
  }
  toggle(wrap) {
    this.wrap(wrap);
  }
  wrapSelect(vals) {
    let self = this,
      range = self.range,
      wrapper;
    wrapper = $(vals);
    // collapsed=true
    if (range.collapsed) {
      range.shrink();
      range.insertNode(wrapper[0]).selectNodeContents(wrapper[0]);
      return self;
    }
    // block wrapper
    let copyWrapper = wrapper.clone(true),
      child = copyWrapper;
    // find inner element
    // while (child.first()) {
    //   child = child.first();
    // }
    child.append(range.extractContents());
    range.insertNode(copyWrapper[0]);
    range.selectNode(copyWrapper[0]);

    // collapsed=false
    // range.enlarge();
    let ancestor = range.commonAncestorContainer,
      isStart = false;
    console.log(ancestor);
    $(ancestor).scan(function(node) {
      if (!isStart) {
        isStart = true;
        return;
      }
      if (isStart) {
        // if (node == bookmark.end) {
        // 	return false;
        // }
        let knode = $(node);
        // if (_inPreElement(knode)) {
        // 	return;
        // }
        if (knode.type == 3 && node.nodeValue.length > 0) {
          // textNode为唯一的子节点时，重新设置node
          let parent;
          while ((parent = knode.parent()) && parent.children().length == 1) {
            knode = parent;
          }
          // _wrapNode(knode, wrapper);
        }
      }
    });
    // range.moveToBookmark(bookmark);
    return self;
  }
  inputHandle() {
    let range = this.range;
    let el = this.getNode(range.commonAncestorContainer);
    if (range.collapsed) {
      if (el.nodeName === "DIV") {
        let p = document.createElement("p");
        p.innerHTML = "<br>";
        el.parentNode.replaceChild(p, el);
      }
    }
  }
}

export default JEditor;
