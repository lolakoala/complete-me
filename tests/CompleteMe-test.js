import { expect } from 'chai';
import CompleteMe from '../scripts/CompleteMe';
import PrefixTreeNode from '../scripts/PrefixTreeNode';
import fs from 'fs';


describe('COMPLETE ME', () => {
  let completion;
  const text = "/usr/share/dict/words";
  const dictionary = fs.readFileSync(text).toString().trim().split('\n');

  beforeEach(() => {
    completion = new CompleteMe();
  });

  it('should start with zero elements', () => {
    expect(completion.length).to.eq(0);
  });

  it('should start with an empty children object', () => {
    expect(completion.children).to.deep.eq({});
  });

  it('should start with an empty array of selected words', () => {
    expect(completion.selected).to.deep.eq([]);
  });

  describe('insert', () => {
    it('should be able to insert a word', () => {
      completion.insert('pizza');
      expect(completion.length).to.eq(1);
    });

    it('should set the endword property of the last letter', () => {
      completion.insert('apple');
      expect(
        completion
          .children['a']
          .children['p']
          .children['p']
          .children['l']
          .children['e'].endWord
      ).to.eq(1);
    });
  });

  describe('makeNewNode', () => {
    it('should make a new node if it doesnt exist', () => {
      completion.makeNewNode(completion, 'a');
      expect(completion.children).to.have.deep.property('a');
      expect(completion.makeNewNode(completion, 'b')).to.be.true;
    });

    it('should not make new node if node exists', () => {
      completion.insert('apple');
      completion.makeNewNode(completion, 'a')
      expect(completion.makeNewNode(completion, 'a')).to.be.false;
    })
  });

  describe('finishWord', () => {
    it('should increment this.length', () => {
      let node = new PrefixTreeNode('a');

      completion.finishWord(node);
      expect(completion.length).to.eq(1);
    });

    it('should set endWord property of node', () => {
      let node = new PrefixTreeNode('a');

      completion.finishWord(node);
      expect(node.endWord).to.eq(1);
    });
  });

  describe('count', () => {
    it('should count its length', () => {
      expect(completion.count()).to.eq(0);
      completion.insert('banana');
      completion.insert('potato');
      expect(completion.count()).to.eq(2);
    });
  });

  describe('suggest', () => {
    it('should return an array of suggestions', () => {
      expect(completion.suggest()).to.deep.eq([]);
    });

    it('should suggest pizza if given piz', () => {
      completion.insert('pizza');
      expect(completion.suggest('piz')).to.deep.eq(['pizza']);
    });

    it('should suggest pizza and pizzeria if given piz', () => {
      completion.insert('pizza');
      completion.insert('pizzeria');
      expect(completion.suggest('piz')).to.deep.eq(['pizza', 'pizzeria']);
    });

    it('should suggest apple if given a', () => {
      completion.insert('apple');
      expect(completion.suggest('a')).to.deep.eq(['apple']);
    });

    it('should suggest nothing if given nothing matches the prefix', () => {
      completion.insert('apple');
      completion.insert('pizza');
      expect(completion.suggest('l')).to.deep.eq([]);
    });

    it('should give lots of words with suggest', (done) => {
      completion.populate(dictionary);
      expect(completion.suggest('piz')).to.deep.eq(
        ["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);

      done();
    }).timeout(25000);

    it('should put selected word at front of suggested array', (done) => {
      completion.populate(dictionary);
      expect(completion.suggest('piz')).to.deep.eq(
        ["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
      completion.select('pizzeria');
      expect(completion.suggest('piz')).to.deep.eq(
        ["pizzeria", "pize", "pizza", "pizzicato", "pizzle"]);

      done();
    }).timeout(25000);

    it('should put multiple selected words at front of suggested array',
    (done) => {
      completion.populate(dictionary);
      expect(completion.suggest('piz')).to.deep.eq(
        ["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
      completion.select('pizzeria');
      completion.select('pizza');
      expect(completion.suggest('piz')).to.deep.eq(
        ["pizzeria", "pizza", "pize", "pizzicato", "pizzle"]);

      done();
    }).timeout(25000);
  });

  describe('populate', () => {
    it('should populate an array of words', () => {
      let wordArray = ['dog', 'bird'];

      completion.populate(wordArray);
      expect(completion.count()).to.eq(2);
    });

    it('should populate the dictionary', (done) => {
      completion.populate(dictionary);
      expect(completion.length).to.eq(235886);

      done();
    }).timeout(25000);
  });

  describe('select', () => {
    it('should push selected words into selected array', () => {
      completion.select('dog');
      expect(completion.selected).to.deep.eq(['dog']);
    });
  });

  describe('prioritizeSelected', () => {
    it('should reorder the array with selected words in front', () => {
      completion.select('dog');
      expect(completion.selected).to.deep.eq(['dog']);
      let dArray = ['do', 'doom', 'doctor', 'dog', 'doughnut'];

      completion.prioritizeSelected(dArray);
      expect(dArray[0]).to.eq('dog');
    });
  });
});
