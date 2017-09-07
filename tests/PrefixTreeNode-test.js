import { expect } from 'chai';
import PrefixTreeNode from '../scripts/PrefixTreeNode';

describe('Node', () => {
  let node;

  beforeEach(() => {
    node = new PrefixTreeNode('a');
  });

  it('should take a vaule', () => {
    expect(node.value).to.eq('a');
  });

  it('should start with no children', () => {
    expect(node.children).to.deep.eq({});
  });

  it('should start with endWord null', () => {
    expect(node.endWord).to.eq(null);
  });
})
