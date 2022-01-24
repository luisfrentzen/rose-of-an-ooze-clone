class Bullet extends GameObject {
  constructor(x, y, w, h, scale = 1, dir, or, speed) {
    super(x, y, w, h, scale);

    this.dieFrames = [[], 0];
    this.loopFrames = [[], 0];

    this.startupFrames = [];
    this.isActive = true;

    this.S_STRAIGHT = 0;
    this.S_DUP = 1;
    this.S_UP = 2;
    this.S_DDOWN = 3;
    this.S_DOWN = 4;

    this.hbWidth = 55 * this.scale;
    this.hbHeight = 55 * this.scale;

    this.orientation = or;
    this.dir = dir;

    this.bulletSpeed = speed;

    this.loadSprites();
  }

  loadSprites() {
    this.dieFrames = this.getSprites("texture-bullet-dies");
    this.loopFrames = this.getSprites("texture-bullet-loop");
  }

  checkCollided() {
    if (this.x + this.hbWidth / 2 > canvasWidth + 200) {
      this.x = canvasWidth + 200 - this.hbWidth;
      return true;
    }
    if (this.y + this.hbHeight / 2 > canvasHeight - groundLevel) {
      this.y = canvasHeight - groundLevel - this.hbHeight;
      return true;
    }
    if (this.x - this.hbWidth / 2 < -200) {
      this.x = -200 + this.hbWidth;
      return true;
    }
    if (this.y - this.hbHeight / 2 < -200) {
      this.y = -200 + this.hbWidth;
      return true;
    }
  }

  die() {
    this.isDied = true;
  }

  update() {
    super.update();

    let spd = this.bulletSpeed;

    let lastX = this.x;
    let lastY = this.y;

    switch (this.dir) {
      case this.S_STRAIGHT:
        this.x += spd * (this.orientation ? -1 : 1);
        break;
      case this.S_DUP:
        this.y -= spd;
        this.x += spd * (this.orientation ? -1 : 1);
        break;
      case this.S_UP:
        this.y -= spd;
        break;
      case this.S_DOWN:
        this.y += spd;
        break;
      case this.S_DDOWN:
        this.y += spd;
        this.x += spd * (this.orientation ? -1 : 1);
        break;
    }

    if (this.isCollidedWith(enemy) && this.isActive) {
      this.isCollided = true;
      this.bulletSpeed = 0;
      this.isActive = false;

      if (lastY > this.y) {
        this.y = enemy.hbY + enemy.hbHeight;
      }

      enemy.takeDamage();
    } else if (this.checkCollided()) {
      this.isCollided = true;
      this.bulletSpeed = 0;
    }
  }

  render(ctx) {
    super.render(ctx);

    let frames = this.loopFrames;

    let fr = frames[0][this.tick % frames[1]];

    if (this.isCollided) {
      if (this.dieFrames[0].length > 0) {
        fr = this.dieFrames[0].shift();
      } else {
        this.die();
        return;
      }
    }

    this.drawW = fr.width * this.scale;
    this.drawH = fr.height * this.scale;

    // this.hbHeight = this.drawH;
    // this.hbWidth = this.drawW;

    this.w = this.drawW;
    this.h = this.drawH;

    this.drawX = this.x - this.drawW / 2;
    this.drawY = this.y - this.drawH / 2;

    ctx.save();

    ctx.translate(this.x, this.y);

    let deg = 0;

    switch (this.dir) {
      case this.S_STRAIGHT:
        this.drawX += 30 * (this.orientation ? -1 : 1) * this.scale;
        break;
      case this.S_UP:
        this.drawX += 90 * (this.orientation ? -1 : 1) * this.scale;
        this.drawY -= 10 * this.scale;
        deg = Math.PI * 0.5 * (this.orientation ? 1 : -1);
        break;
      case this.S_DUP:
        this.drawX += 40 * (this.orientation ? -1 : 1);
        deg = Math.PI * 0.25 * (this.orientation ? 1 : -1);
        break;
      case this.S_DOWN:
        deg = Math.PI * 0.5 * (this.orientation ? -1 : 1);
        break;
      case this.S_DDOWN:
        this.drawX += 40 * (this.orientation ? -1 : 1);
        deg = Math.PI * 0.25 * (this.orientation ? -1 : 1);
        break;
    }

    ctx.rotate(deg);

    ctx.translate(-this.x, -this.y);

    if (this.orientation) {
      ctx.scale(-1, 1);

      this.drawX = this.drawX * -1 - this.drawW;
    }

    this.hbX =
      this.drawX +
      (this.dir == this.S_STRAIGHT ? this.drawW : 0) -
      this.hbWidth / (this.dir == this.S_UP ? 1 : 2);
    this.hbY =
      (this.dir == this.S_UP ? this.y - this.drawH * 5 : this.y) -
      this.hbHeight / 2;

    ctx.drawImage(fr, this.drawX, this.drawY, this.drawW, this.drawH);
    ctx.restore();

    if (showHitboxes)
      ctx.strokeRect(this.hbX, this.hbY, this.hbWidth, this.hbHeight);
  }
}
