import _ from 'lodash';
import p5 from 'p5';

class Packer {
  fit(blocks, w, h) {
    const root = {x: 0, y: 0, w, h};
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
  const grout = 0;
  const tileImages = [];
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
    const indicies = [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
    ];
    const stations = [
      'alexanderplatz',
      'bernauerstrasse',
      'boddinstrasse',
      'gesundbrunnen',
      'heinrichheinestrasse',
      'hermannplatz',
      'jannowitzbrucke',
      'kottbussertor',
      'leinestrasse',
      'moritzplatz',
      'rosenthalerplatz',
      'schonleinstrasse',
      'voltastrasse',
      'weinmeisterstrasse',
    ];
    for (let index of indicies) {
      for (let station of stations) {
        const imagePath = require(`../assets/${station}_${index}.jpg`);
        tileImages.push(p5.loadImage(imagePath));
      }
    }
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    for (let image of tileImages) {
      protoTiles.push({w: image.width, h: image.height, image});
    }
    p5.reset();
    p5.frameRate(60);
  };

  p5.reset = () => {
    const shuffledTiles = _.shuffle(protoTiles);
    const tiles = packer.fit(shuffledTiles, width + 100, height);
    p5.clear();
    p5.background(40);
    for (let tile of tiles) {
      if ('fit' in tile) {
        p5.image(
          tile.image,
          tile.fit.x + grout,
          tile.fit.y + grout,
          tile.w - 2 * grout,
          tile.h -2 * grout,
        );
      }
    }
  };
};

new p5(sketch);
