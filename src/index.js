import _ from 'lodash';
import p5 from 'p5';

require.context('../assets/', true, /\.(png|svg|jpg|gif)$/);

class Packer {
  fit(blocks, w, h) {
    const root = {x: 0, y: 0, w: w + 100, h: h};
    let node;
    let nBlocks = [];
    for (let block of blocks) {
      if ((node = this.findNode(root, block.w, block.h))) {
        const nBlock = Object.assign(block, {
          fit: this.splitNode(node, block.w, block.h),
        });
        nBlocks.push(nBlock);
      }
    }
    return nBlocks;
  }

  findNode(root, w, h) {
    if (root.used)
      return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
    else if (w <= root.w && h <= root.h) return root;
    else return null;
  }

  splitNode(node, w, h) {
    node.used = true;
    node.down = {x: node.x, y: node.y + h, w: node.w, h: node.h - h};
    node.right = {x: node.x + w, y: node.y, w: node.w - w, h: h};
    return node;
  }
}

const sketch = p5 => {
  const canvasWidth = p5.windowWidth;
  const canvasHeight = p5.windowHeight;

  window.p5 = p5;

  const packer = new Packer();

  const width = 800;
  const height = 800;
  var testImage;
  const pastelColors = ['red', 'orange', 'yellow', 'green', 'blue'];
  const dimensions = [{w: 100, h: 100}, {w: 178, h: 100}, {w: 150, h: 100}];
  const generateBlocks = size => {
    let b = [];
    for (let i = 0; i < size; i++) {
      let d = _.sample(dimensions);
      let c = _.sample(pastelColors);
      b.push({w: d.w, h: d.h, c: c});
    }
    return b;
  };

  const protoBlocks = generateBlocks(80);
  const protoTiles = [];

  p5.keyPressed = () => {
    switch (p5.key) {
      case 'S':
        p5.save(`tile-${Date.now()}.png`);
        break;
      case 'R':
        p5.reset();
    }
  };

  p5.preload = () => {
    testImage = p5.loadImage('assets/test/test_x100_01.jpg');
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.noStroke();
    p5.reset();
    p5.frameRate(60);
  };

  p5.reset = () => {
    const pastelColorMap = {
      red: p5.color(255, 179, 186),
      orange: p5.color(255, 223, 186),
      yellow: p5.color(255, 255, 186),
      green: p5.color(186, 255, 201),
      blue: p5.color(186, 255, 255),
    };

    const shuffledBlocks = _.shuffle(protoBlocks);
    const blocks = packer.fit(shuffledBlocks, width, height);
    p5.clear();
    for (let b of blocks) {
      if ('fit' in b) {
        p5.fill(pastelColorMap[b.c]);
        p5.rect(b.fit.x, b.fit.y, b.w, b.h);
      }
    }
  };

  p5.reset2 = () => {
    console.log(testImage);
    p5.ellipse(0, 0, 100, 100);
    p5.image(testImage, 0, 0, 100, 100);
  };
};

new p5(sketch);
