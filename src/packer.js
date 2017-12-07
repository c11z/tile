import _ from 'lodash';

export default class Packer {
  fit(blocks, w, h) {
    const root = {x: -200, y: 0, w, h};
    const fittedBlocks = [];
    let node;
    for (let block of blocks) {
      if ((node = this.findNode(root, block.w, block.h))) {
        fittedBlocks.push(
          Object.assign(block, {
            fit: this.splitNode(node, block.w, block.h),
          }),
        );
      }
    }
    return fittedBlocks;
  }

  findNode(root, w, h) {
    if (root.used)
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    else if (w <= root.w && h <= root.h) return root;
    else return null;
  }

  splitNode(node, w, h) {
    node.used = true;
    node.down = {
      x: node.x + _.random(-50, 50),
      y: node.y + h,
      w: node.w,
      h: node.h - h,
    };
    node.right = {x: node.x + w, y: node.y, w: node.w - w, h: h};
    return node;
  }
}
