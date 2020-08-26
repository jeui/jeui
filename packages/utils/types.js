export function isString(obj) {
  return Object.prototype.toString.call(obj) === "[object String]";
}

export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}
