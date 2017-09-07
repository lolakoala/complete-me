import PrefixTreeNode from './PrefixTreeNode';

export default class CompleteMe {
  constructor() {
    this.children = {};
    this.length = 0;
    this.selected = [];
  }

  count() {
    return this.length;
  }

  insert(string) {
    let stringArray = string.split('');
    let current = this;

    stringArray.forEach((letter, index) => {
      let childKeys = Object.keys(current.children);

      if (!childKeys.includes(letter) && letter !== stringArray[stringArray.length]) {
        current.children[letter] = new PrefixTreeNode(letter);
      }
      current = current.children[letter];
      if (index === stringArray.length - 1) {
        current.endWord = 1;
        this.length++;
        return;
      }

    })
  }

  findLastNode(string) {
    let stringArray = string.split('');
    let current = this;

    stringArray.forEach((letter) => {
      current = current.children[letter];
    });
    return current;
  }

  pushWords(string, current, allWordsArray) {
    let childKeys = Object.keys(current.children);
    let newWord;

    for (let i = 0; i < childKeys.length; i ++) {
      let letter = childKeys[i];

      newWord = string.concat(letter);
      let child = current.children[letter];

      if (child.endWord) {
        allWordsArray.push(newWord);
      }
      this.pushWords(newWord, child, allWordsArray);
    }
    return allWordsArray;
  }

  suggest(string) {
    let allWordsArray = [];
    let keys = Object.keys(this.children);

    if (string && keys.includes(string.charAt(0))) {
      let current = this.findLastNode(string);

      this.pushWords(string, current, allWordsArray);
    }

    allWordsArray.map((word, index, allWords) => {
      if (this.selected.includes(word)) {
        allWords.splice(index, 1);
        allWords.unshift(word);
      }
    });
    return allWordsArray;
  }

  populate(array) {
    array.forEach((word) => {
      this.insert(word);
    })
  }

  select(word) {
    if (!this.selected.includes(word)) {
      this.selected.push(word);
    }
  }
}
