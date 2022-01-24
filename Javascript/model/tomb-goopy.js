class TombGoopy extends GameObject {
  constructor(x, y, w, h, scale = 1) {
    super(x, y, w, h, scale);

    this.isDead = false;

    // phase 3
    this.leftFrames = [];
    this.rightFrames = [];
    this.leftTransFrames = [];
    this.rightTransFrames = [];

    this.fallFrames = [];
    this.slamFrames = [];
    this.tranFrames = [];
    this.attackingFrames = [];
    this.deathFrames = [];

    this.moveLeftDustFrames = [];
    this.moveRightDustFrames = [];
    this.moveLeftDustTransFrames = [];
    this.moveRightDustTransFrames = [];

    this.dustFrames = [];
    this.fallDustFrames = [];

    this.renderMovingDust = [];
    this.renderAttack = [];
    this.renderMovingDust = [];
    this.renderDust = [];
    this.impromptFrames = [];
    this.introFrames = [];

    this.yOff = [
      10, 15, 62, 117, 250, 310, 335, 240, 107, 107, 62, 62, 32, 32, 12, 12,
    ];

    this.isFalling = true;
    this.inIntro = true;

    this.hp = 75;

    this.orientation = 0;
    this.readyAttack = false;

    this.hbWidth = 50;
    this.hbHeight = 50;

    this.speed = 60 * this.scale;
    this.localGravity = GRAVITY * 0.2;

    this.deathSounds = [];
    this.fallSounds = [];
    this.smashSounds = [];
    this.moveSounds = [];

    this.loadSprites();
    this.loadSounds();
  }

  loadSounds() {
    this.deathSounds = this.getSounds("sound-goopy-phase3-death");
    this.fallSounds = this.getSounds("sound-goopy-phase3-drop");
    this.smashSounds = this.getSounds("sound-goopy-phase3-smash");
    this.moveSounds = this.getSounds("sound-goopy-phase3-slide");

    for (let s of this.deathSounds[0]) {
      s.volume = 0.5;
    }

    for (let s of this.fallSounds[0]) {
      s.volume = 0.5;
    }

    for (let s of this.moveSounds[0]) {
      s.volume = 0.2;
    }

    for (let s of this.smashSounds[0]) {
      s.volume = 0.7;
    }
  }

  loadSprites() {
    this.leftFrames = this.getSprites("texture-goopy-phase3-move-left");
    this.rightFrames = this.getSprites("texture-goopy-phase3-move-right");
    this.leftTransFrames = this.getSprites("texture-goopy-phase3-trans-left");
    this.rightTransFrames = this.getSprites("texture-goopy-phase3-trans-right");

    this.fallFrames = this.getSprites("texture-goopy-phase3-fall");
    this.slamFrames = this.getSprites("texture-goopy-phase3-slam");
    this.tranFrames = this.getSprites("texture-goopy-phase3-trans");
    this.attackingFrames = this.getSprites("texture-goopy-phase3-attack");
    this.dustFrames = this.getSprites("texture-goopy-phase3-smash-dust");
    this.fallDustFrames = this.getSprites("texture-goopy-phase3-fall-dust");

    this.deathFrames = this.getSprites("texture-goopy-phase3-death");

    this.moveLeftDustFrames = this.getSprites(
      "texture-goopy-phase3-move-left-dust"
    );
    this.moveRightDustFrames = this.getSprites(
      "texture-goopy-phase3-move-right-dust"
    );
    this.moveLeftDustTransFrames = this.getSprites(
      "texture-goopy-phase3-move-left-trans-dust"
    );
    this.moveRightDustTransFrames = this.getSprites(
      "texture-goopy-phase3-move-right-trans-dust"
    );
  }

  die() {
    this.isDead = true;
    this.velocity = [0, 0, 0, 0];
    this.renderMovingDust = [];
    this.deathSounds[0][0].play();

    announcer.playerWin();
  }

  checkWalled() {
    if (
      this.x - this.drawW / 2.5 <= 0 &&
      this.velocity[this.K_LEFT] > this.velocity[this.K_RIGHT]
    ) {
      this.impromptFrames.push(...this.leftTransFrames[0].reverse());
      this.leftTransFrames[0].reverse();

      this.right();
    } else if (
      this.x + this.drawW / 2.5 >= canvasWidth &&
      this.velocity[this.K_LEFT] < this.velocity[this.K_RIGHT]
    ) {
      this.impromptFrames.push(...this.rightTransFrames[0].reverse());
      this.rightTransFrames[0].reverse();

      this.left();
    }
  }

  isAttacking() {
    return this.renderAttack.length > 0;
  }

  attack() {
    this.smashSounds[0][Math.floor(Math.random() * this.smashSounds[1])].play();

    this.renderAttack.push(...this.attackingFrames[0]);

    if (this.velocity[this.K_RIGHT] > this.velocity[this.K_LEFT]) {
      this.impromptFrames.push(...this.rightTransFrames[0]);
    } else {
      this.impromptFrames.push(...this.leftTransFrames[0]);
    }

    this.readyAttack = false;
  }

  left() {
    this.moveSounds[0][Math.floor(Math.random() * this.moveSounds[1])].play();
    this.velocity[this.K_LEFT] = this.speed;
    this.velocity[this.K_RIGHT] = 0;

    this.renderMovingDust.push(...this.moveLeftDustTransFrames[0]);
    this.impromptFrames.push(...this.leftTransFrames[0]);
  }

  right() {
    this.moveSounds[0][Math.floor(Math.random() * this.moveSounds[1])].play();
    this.velocity[this.K_RIGHT] = this.speed;
    this.velocity[this.K_LEFT] = 0;

    this.renderMovingDust.push(...this.moveRightDustTransFrames[0]);
    this.impromptFrames.push(...this.rightTransFrames[0]);

    this.readyAttack = true;
  }

  takeDamage() {
    this.hp -= 1;

    if (this.hp <= 0 && !this.isDead) {
      this.die();
    }
  }

  update() {
    if (isFrozen) {
      return;
    }

    super.update();
    let dist = Math.abs(Math.abs(canvasWidth / 2 - this.x) - canvasWidth / 2);
    dist = dist / (canvasWidth / 2 + 150);

    let vX = this.velocity[this.K_RIGHT] - this.velocity[this.K_LEFT];
    let vY = this.velocity[this.K_DOWN] - this.velocity[this.K_UP];

    if (!this.inIntro) {
      vX *= dist;
      vY *= dist;
    }

    let rX = this.isAttacking() ? this.x : this.x + vX;
    let rY = this.y + vY;

    this.x = rX;
    this.y = rY >= canvasHeight - groundLevel ? canvasHeight - groundLevel : rY;

    if (!this.isGrounded()) {
      this.velocity[this.K_DOWN] += this.localGravity;
    } else {
      if (this.isFalling) {
        let s = this.fallSounds[0][0];
        if (this.y >= -250 && s.paused == true && s.currentTime == 0) {
          s.play();
        }

        this.isFalling = false;
        this.velocity[this.K_DOWN] = 0;
        this.velocity[this.K_UP] = 0;

        goopy.explode();
        shake(6);
        this.renderDust.push(...this.fallDustFrames[0]);

        this.impromptFrames.push(...this.slamFrames[0]);
        for (let i = 0; i < 10; i++) {
          this.impromptFrames.push(...this.tranFrames[0]);
        }
      }

      if (this.isAttacking()) {
        let rem = this.attackingFrames[1] - this.renderAttack.length;

        if (rem == 15) {
          this.renderDust.push(...this.dustFrames[0]);
          shake(5);
        }
      }

      if (this.impromptFrames.length == 0 && this.inIntro) {
        this.left();
        this.inIntro = false;
      }

      if (!this.inIntro) {
        this.checkWalled();
      }

      if (this.readyAttack) {
        let objx = player.hbX;
        let objw = player.hbWidth;

        let dx = this.hbX;
        let dw = this.hbWidth;

        let objor = player.orientation;

        if (objor == 1) {
          objx = objx * -1 - objw;
        }

        if (dx + dw > objx && dx < objx + objw) {
          this.attack();
        }
      }
    }
  }

  render(ctx) {
    super.render();
    ctx.save();

    let offset = -(player.x - canvasWidth / 2) * 0.02;

    let frame;
    let fr;

    if (this.isDead) {
      frame = this.deathFrames;
      fr = frame[0][this.tick % frame[1]];
    } else if (this.isAttacking()) {
      fr = this.renderAttack.shift();
    } else if (this.impromptFrames.length > 0) {
      fr = this.impromptFrames.shift();
    } else {
      if (this.isFalling) {
        fr = this.fallFrames[0][0];
      } else {
        if (this.velocity[this.K_RIGHT] > this.velocity[this.K_LEFT]) {
          frame = this.rightFrames;
        } else {
          frame = this.leftFrames;
        }

        fr = frame[0][this.tick % frame[1]];
      }
    }

    this.drawW = fr.width * this.scale;
    this.drawH = fr.height * this.scale;

    this.w = this.drawW;
    this.h = this.drawH;

    this.hbHeight = this.drawH * 0.3;
    this.hbWidth = this.drawW * 0.3;

    this.drawX = this.x - this.drawW / 2;
    this.drawY = this.y - this.drawH;

    if (this.isAttacking()) {
      let rem = this.attackingFrames[1] - this.renderAttack.length;

      if (rem >= 11 && rem < 11 + this.yOff.length)
        this.drawY += this.yOff[rem - 11] * this.scale;
    }

    ctx.drawImage(fr, this.drawX + offset, this.drawY, this.drawW, this.drawH);

    if (this.renderDust.length > 0) {
      let d = this.renderDust.shift();
      let dW = d.width * this.scale;
      let dH = d.height * this.scale;

      let dX = this.drawX + this.drawW / 2 - dW / 2;
      let dY = canvasHeight - groundLevel * 1.23 - dH / 2;

      if (d.className == "texture-goopy-phase3-fall-dust") {
        dY -= 180;
      }

      ctx.drawImage(d, dX + offset, dY, dW, dH);
    }

    if (this.velocity[this.K_LEFT] - this.velocity[this.K_RIGHT] != 0) {
      let df;
      let isImp = false;
      let dX;
      let dY;

      if (this.velocity[this.K_RIGHT] > this.velocity[this.K_LEFT]) {
        df = this.moveRightDustFrames;
      } else {
        df = this.moveLeftDustFrames;
      }

      let d = df[0][this.tick % df[1]];

      if (this.renderMovingDust.length > 0) {
        d = this.renderMovingDust.shift();
        isImp = true;
      }

      let dW = d.width * this.scale;
      let dH = d.height * this.scale;

      if (this.velocity[this.K_RIGHT] > this.velocity[this.K_LEFT]) {
        dX = this.drawX + this.drawW - dW + 15 * this.scale;
      } else {
        dX = this.drawX - 15 * this.scale;
      }

      dY =
        canvasHeight -
        groundLevel * (this.renderMovingDust.length > 0 ? 1.3 : 1.4) -
        dH / 2;

      if (!this.isAttacking()) {
        ctx.drawImage(d, dX + offset, dY, dW, dH);
      }
    }

    this.hbX = this.drawX + this.drawW / 2 - this.hbWidth / 2;
    this.hbY = this.drawY + this.drawH * 0.25;

    if (showHitboxes)
      ctx.strokeRect(this.hbX, this.hbY, this.hbWidth, this.hbHeight);

    ctx.restore();
  }
}
