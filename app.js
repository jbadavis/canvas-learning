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

    // this.setImageGreyscale(img);

  }

  handleUp() {
    this.mouseDown = false;
  }

  handleMove(e) {
    if (this.mouseDown) {
      // Here we need to check if a mouse is over the image required to move and
      // if the pixel value is not transparent (i.e. !== 0).
      const img = this.imgs[1];
      const imageData = this.ctx.getImageData(img.x, img.y, img.width, img.height);
      const data = imageData.data;

      // The Uint8ClampedArray contains height × width × 4 bytes of data, with
      // index values ranging from 0 to (height×width×4)-1.
      //
      // For example, to read the blue component's value from the pixel at
      // column 200, row 50 in the image, you would do the following:
      // blueComponent = data[((100 * (imageData.width * 4)) + (200 * 4)) + 2];
      data[((50 * (imageData.width * 4)) + (200 * 4)) + 0]  = 0;

      // Where is the mouse?
      const rect = this.canvas.getBoundingClientRect();
      const canvasTop = rect.top;
      const canvasBottom = rect.bottom;
      const canvasLeft = rect.left;
      const canvasRight = rect.right;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // The relative position of the mouse within the canvas element.
      const xPos = mouseX - canvasLeft;
      const yPos = mouseY - canvasTop;

      data[((yPos * (imageData.width * 4)) + (xPos * 4)) + 0] = 0;
      data[((yPos * (imageData.width * 4)) + (xPos * 4)) + 1] = 0;
      data[((yPos * (imageData.width * 4)) + (xPos * 4)) + 2] = 5;

      this.ctx.putImageData(imageData, img.x, img.y);
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
