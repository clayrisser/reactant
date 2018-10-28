const { Element, CharacterData, DocumentType } = window;

if (!Element.prototype.replaceWith) {
  Element.prototype.replaceWith = replaceWith;
}
if (!CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = replaceWith;
}
if (!DocumentType.prototype.replaceWith) {
  DocumentType.prototype.replaceWith = replaceWith;
}

function replaceWith() {
  const parent = this.parentNode;
  let i = arguments.length;
  let currentNode;
  if (!parent) return;
  if (!i) parent.removeChild(this);
  while (i--) {
    currentNode = arguments[i];
    if (typeof currentNode !== 'object') {
      currentNode = this.ownerDocument.createTextNode(currentNode);
    } else if (currentNode.parentNode) {
      currentNode.parentNode.removeChild(currentNode);
    }
    if (!i) {
      parent.replaceChild(currentNode, this);
    } else {
      parent.insertBefore(this.previousSibling, currentNode);
    }
  }
}
