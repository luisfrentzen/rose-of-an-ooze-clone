class ScreenFX extends GameObject {
  constructor(x, y, w, h, scale = 1) {
    super(x, y, w, h, (scale = 1));

    this.frames = [[], 0];

    this.loadSprites();
    this.blend = "multiply";
  }

  loadSprites() {
    this.frames = this.getSprites("texture-screen-fx");
  }

  update() {
    super.update();
  }

  render(ctx) {
    if (!isStarted) {
      return;
    }

    super.render(ctx);

    ctx.save();

    let fr = this.frames[0][this.tick % this.frames[1]];

    ctx.globalCompositeOperation = this.blend;

    ctx.drawImage(fr, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(fr, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(fr, 0, 0, canvasWidth, canvasHeight);

    ctx.restore();
  }
}
