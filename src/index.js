import _ from 'lodash';
import p5 from 'p5';
import Packer from './packer';

const sketch = p5 => {
  const canvasWidth = p5.windowWidth;
  const canvasHeight = p5.windowHeight;
  window.p5 = p5;

  const packer = new Packer();
  const width = 1000;
  const height = 600;
  const grout = 2;
  const tileImages = {};
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
    for (let station of stations) {
      tileImages[station] = [];
      for (let index of indicies) {
        const imagePath = require(`../assets/${station}_${index}.jpg`);
        tileImages[station].push(p5.loadImage(imagePath));
      }
    }
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.frameRate(1);
  };

  p5.reset = () => {
    const station = _.sample(stations);
    const protoTiles = [];
    let n = 300;
    while (n-- > 0) {
      const image = _.sample(tileImages[station]);
      protoTiles.push({w: image.width, h: image.height, image});
    }
    const tiles = packer.fit(protoTiles, width + 400, height);
    p5.clear();
    p5.background(20);
    for (let tile of tiles) {
      if ('fit' in tile) {
        p5.image(
          tile.image,
          tile.fit.x + grout,
          tile.fit.y + grout,
          tile.w - 2 * grout,
          tile.h - 2 * grout,
        );
      }
    }
  };

  p5.draw = () => {
    p5.reset();
  };
};

new p5(sketch);
