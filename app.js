import $ from 'jquery';

class ImageOverlay {
  constructor() {
    this.imgs = [
      {
        path: '/imgs/mask.png',
        x: 100,
        y: 0
      }, {
        path: '/imgs/dog.png',
        x: 0,
        y: 0,
        width: 537,
        height: 800
      }
    ];

    this.canvasDimentions = {
      width: 500,
      height: 300
    };

    this.mouseDown = false;

    this.init();
  }

  addToCanvas(i, img) {
    if (i > 0) {
      this.ctx.globalCompositeOperation = 'source-in';
    }

    this.ctx.drawImage(img.elm, img.x, img.y);
  }

  loadImages() {
    this.imgs.forEach((img, i) => {
      const imgElm = new Image();

      imgElm.onload = () => {
        this.imgs[i].elm = imgElm;

        this.addToCanvas(i, this.imgs[i]);
      };

      imgElm.src = img.path;
    });
  }

  initCanvas() {
    this.canvas = document.getElementById("canvas");
    this.$canvas = $('#canvas');

    this.canvas.width = this.canvasDimentions.width;
    this.canvas.height = this.canvasDimentions.height;

    this.ctx = this.canvas.getContext('2d');
  }

  setImageGreyscale(img) {
    const imageData = this.ctx.getImageData(img.x, img.y, img.width, img.height);
    const data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }

    this.ctx.putImageData(imageData, img.x, img.y);
  }

  handleDown() {
    this.mouseDown = true;

    const img = this.imgs[1];

    this.setImageGreyscale(img);

  }

  handleUp() {
    this.mouseDown = false;
  }

  handleMove(e) {
    if (this.mouseDown) {
      // Here we need to check if a mouse is over the image required to move and
      // if the pixel value is not transparent (i.e. !== 0).
    };
  }

  events() {
    this.$canvas.on('mousedown', (e) => this.handleDown(e))
      .on('mouseup', (e) => this.handleUp(e))
      .on('mousemove', (e) => this.handleMove(e));
  };

  init() {
    this.initCanvas();

    this.loadImages();

    this.events();
  }
}

new ImageOverlay();
