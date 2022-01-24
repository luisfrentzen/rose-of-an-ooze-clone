class Environment extends GameObject {
  constructor(x, y, w, h, scale = 1) {
    super(x, y, w, h);

    this.backgrounds = [];
    this.middlegrounds = [];
    this.foregrounds = [];
    this.backgroundStreamFrames = [];

    this.backgroundOffset = 0.015;
    this.middlegroundOffset = 0.02;
    this.foregroundOffset = 0.027;

    this.loadSprites();
  }

  loadSprites() {
    this.backgrounds = this.getSprites("environment-background");
    this.middlegrounds = this.getSprites("environment-middleground");
    this.foregrounds = this.getSprites("environment-foreground");
  }

  renderBackground(ctx, playerX) {
    let frames = this.backgrounds[0];
    let fr = frames[0];

    let drawX = this.x;
    let drawY = this.y;

    let offset = -(playerX - canvasWidth / 2) * (this.backgroundOffset * 0.6);

    let drawW = canvasWidth * 1.1;
    let drawH = (fr.height * drawW) / fr.width;
    drawX = this.x + (this.x + canvasWidth - drawW) / 2;
    drawY = this.y + canvasHeight * 0.75 - drawH;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fr = frames[1];

    offset = -(playerX - canvasWidth / 2) * (this.backgroundOffset * 0.3);

    drawW = canvasWidth * 1.1;
    drawH = (fr.height * drawW) / fr.width;
    drawX = this.x + (this.x + canvasWidth - drawW) / 2;
    drawY = this.y + canvasHeight * 0.5 - drawH;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fr = frames[2];
    offset = -(playerX - canvasWidth / 2) * this.backgroundOffset;

    drawW = canvasWidth * 1.1;
    drawH = (fr.height * drawW) / fr.width;
    drawX = this.x + (this.x + canvasWidth - drawW) / 2;
    drawY = this.y + canvasHeight * 0.66 - drawH;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);
  }

  renderMiddleground(ctx, playerX) {
    let offset = -(playerX - canvasWidth / 2) * this.middlegroundOffset;

    for (let fr of this.middlegrounds[0]) {
      let drawX = this.x;
      let drawY = this.y;

      let drawW = canvasWidth * 1.25;
      let drawH = (fr.height * drawW) / fr.width;
      drawX = this.x + (this.x + canvasWidth - drawW) / 2;
      drawY = this.y + (this.y + canvasHeight - drawH) / 2;
      ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);
    }
  }

  renderForeground(ctx, playerX) {
    let offset = -(playerX - canvasWidth / 2) * this.foregroundOffset;

    let frames = this.foregrounds[0];
    let beams = frames[6];
    let leaves1 = frames[0];
    let leaves2 = frames[1];
    let leftBranch = frames[2];
    let rightBranch = frames[3];
    let leftMushroom = frames[4];
    let rightMushroom = frames[5];

    let drawX = 0;
    let drawY = 0;
    let drawW = 0;
    let drawH = 0;
    let fr = null;
    let fgScale = 0.85;

    fgScale = 0.72;

    fr = leftMushroom;
    drawX = -canvasWidth * 0.1;
    drawY = canvasHeight * 0.73;
    drawW = fr.width * fgScale;
    drawH = fr.height * fgScale;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fr = rightMushroom;
    drawX = canvasWidth * 0.43;
    drawY = canvasHeight * 0.68;
    drawW = fr.width * fgScale;
    drawH = fr.height * fgScale;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fr = beams;
    drawW = canvasWidth * 1.3;
    drawH = canvasHeight;
    drawX = canvasWidth / 2 - drawW / 2;
    drawY = 0;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fgScale = 0.75;

    fr = leaves1;
    drawX = canvasWidth * 0.48;
    drawY = -30;
    drawW = fr.width * fgScale;
    drawH = fr.height * fgScale;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fr = leaves2;
    drawX = canvasWidth * 0.85;
    drawY = -30;
    drawW = fr.width * fgScale;
    drawH = fr.height * fgScale;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fr = leftBranch;
    drawX = -canvasWidth * 0.05;
    drawY = -70;
    drawW = fr.width * fgScale;
    drawH = fr.height * fgScale;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);

    fr = rightBranch;
    drawX = canvasWidth * 0.85;
    drawY = -70;
    drawW = fr.width * fgScale;
    drawH = fr.height * fgScale;
    ctx.drawImage(fr, drawX + offset, drawY, drawW, drawH);
  }
}
