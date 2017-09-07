export default class PrefixTreeNode {
  constructor(value) {
    this.value = value;
    this.endWord = null;
    this.children = {};
  }
}
