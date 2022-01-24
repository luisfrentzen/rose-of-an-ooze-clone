class GameObject {
  constructor(x, y, w, h, scale = 1) {
    this.x = x;
    this.y = y;
    this.id = id++;

    this.scale = scale;

    this.w = w * this.scale;
    this.h = h * this.scale;

    this.hbWidth = this.w;
    this.hbHeight = this.h;

    this.hbX = this.x;
    this.hbY = this.y;

    this.drawX;
    this.drawY;
    this.drawH;
    this.drawW;

    this.tick = 0;

    this.speed = 0;
    this.velocity = [0, 0, 0, 0];

    this.isGravity = false;
    this.isCollided = false;
    this.isDied = false;

    this.K_LEFT = 0;
    this.K_UP = 1;
    this.K_RIGHT = 2;
    this.K_DOWN = 3;
  }

  getSprites(cls) {
    let sprites = [[], 0];
    sprites[0] = [...document.getElementsByClassName(cls)];
    sprites[1] = sprites[0].length;

    return sprites;
  }

  getSounds(cls) {
    let s = document.getElementsByClassName(cls);
    return [s, s.length];
  }

  getSound(id) {
    return document.getElementById(id);
  }

  isCollidedWith(obj) {
    let objx = obj.hbX;
    let objy = obj.hbY;
    let objw = obj.hbWidth;
    let objh = obj.hbHeight;

    let dx = this.hbX;
    let dy = this.hbY;
    let dw = this.hbWidth;
    let dh = this.hbHeight;

    let objor = obj.orientation;
    let dor = this.orientation;

    if (objor == 1) {
      objx = objx * -1 - objw;
    }

    if (dor == 1) {
      dx = dx * -1 - dw;
    }

    ctx.strokeStyle = "red";
    if (showHitboxes) ctx.strokeRect(dx, dy, dw, dh);
    if (showHitboxes) tx.strokeRect(objx, objy, objw, objh);
    ctx.strokeStyle = "black";

    if (
      dx + dw > objx &&
      dy + dh > objy &&
      dx < objx + objw &&
      dy < objy + objh
    ) {
      return true;
    }

    return false;
  }

  isGrounded() {
    return this.y >= canvasHeight - groundLevel;
  }

  render(ctx) {
    this.update();
  }

  update() {
    this.tick++;
  }
}
