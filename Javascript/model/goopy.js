class Goopy extends GameObject {
  constructor(x, y, w, h, scale = 1) {
    super(x, y, w, h, scale);

    this.preJumpFrames = [];
    this.upFrames = [];
    this.upTurnFrames = [];
    this.downFrames = [];
    this.downTurnFrames = [];
    this.upDownTransFrames = [];
    this.shadowFrames = [];
    this.dustFrames = [];
    this.dizzyFrames = [];
    this.blowUpFrames = [];

    this.isDizzy = false;

    this.hp = 50;

    this.renderShadow = [];
    this.turningFrames = [];
    this.prepFrames = [];
    this.improptFrames = [];
    this.renderDust = [];
    this.renderExplosion = [];

    this.groundShadowLevel = 3.2;

    this.isJumping = false;

    this.phase = 1;
    this.orientation = 0;

    this.speed = 23 * this.scale;
    this.jumpSpeed = 65 * this.scale;
    this.jumpSpeedDiff = 6 * this.scale;

    this.localGravity = GRAVITY * 0.6;

    this.jumpSounds = [];
    this.landSounds = [];
    this.transSounds = [];
    this.deathSound = [];
    this.deathFallSound = [];

    this.loadSprites();
    this.loadSounds();
  }

  loadSounds() {
    this.jumpSounds = this.getSounds("sound-goopy-phase1-jump");
    this.landSounds = this.getSounds("sound-goopy-phase1-land");
    this.transSounds = this.getSounds("sound-goopy-phase1-transform");

    for (let s of this.jumpSounds[0]) {
      s.volume = 0.5;
    }

    for (let s of this.landSounds[0]) {
      s.volume = 0.5;
    }

    for (let s of this.transSounds[0]) {
      s.volume = 0.5;
    }
  }

  loadSoundsPhase2() {
    this.jumpSounds = this.getSounds("sound-goopy-phase2-jump");
    this.landSounds = this.getSounds("sound-goopy-phase2-land");
    this.deathSound = this.getSounds("sound-goopy-phase2-death");
    this.deathFallSound = this.getSounds("sound-goopy-phase2-death-fall");

    for (let s of this.jumpSounds[0]) {
      s.volume = 0.5;
    }

    for (let s of this.landSounds[0]) {
      s.volume = 0.5;
    }

    for (let s of this.deathSound[0]) {
      s.volume = 0.5;
    }

    for (let s of this.deathFallSound[0]) {
      s.volume = 0.5;
    }
  }

  loadSprites() {
    this.preJumpFrames = this.getSprites("texture-goopy-phase1-jump");
    this.upFrames = this.getSprites("texture-goopy-phase1-up");
    this.upTurnFrames = this.getSprites("texture-goopy-phase1-up-turn");
    this.downFrames = this.getSprites("texture-goopy-phase1-down");
    this.downTurnFrames = this.getSprites("texture-goopy-phase1-down-turn");
    this.upDownTransFrames = this.getSprites(
      "texture-goopy-phase1-updown-trans"
    );
    this.dustFrames = this.getSprites("texture-goopy-phase1-dust");
    this.introFrames = this.getSprites("texture-goopy-intro");
    this.shadowFrames = this.getSprites("texture-goopy-phase1-shadow");
  }

  loadSpritesPhase2() {
    this.dustFrames = this.getSprites("texture-goopy-phase2-dust");
    this.preJumpFrames = this.getSprites("texture-goopy-phase2-jump");
    this.upFrames = this.getSprites("texture-goopy-phase2-up");
    this.upTurnFrames = this.getSprites("texture-goopy-phase2-up-turn");
    this.downFrames = this.getSprites("texture-goopy-phase2-down");
    this.downTurnFrames = this.getSprites("texture-goopy-phase2-down-turn");
    this.upDownTransFrames = this.getSprites(
      "texture-goopy-phase2-updown-trans"
    );
    this.introFrames = this.getSprites("texture-goopy-phase2-intro");
    this.shadowFrames = this.getSprites("texture-goopy-phase2-shadow");
    this.dizzyFrames = this.getSprites("texture-goopy-phase2-dizzy");
    this.blowUpFrames = this.getSprites("texture-goopy-phase2-explode");
  }

  takeDamage() {
    updateScore();
    this.hp -= 1;
  }

  checkWalled() {
    if (this.x - this.drawW <= 0 && this.orientation == 0) {
      this.x = this.drawW;
      this.changeOrientation(1);
      return true;
    }

    if (this.x + this.drawW >= canvasWidth && this.orientation == 1) {
      this.x = canvasWidth - this.drawW;
      this.changeOrientation(0);
      return true;
    }

    return false;
  }

  walled() {
    let frame;

    if (this.velocity[this.K_DOWN] < this.velocity[this.K_UP]) {
      frame = this.upTurnFrames[0];
    } else {
      frame = this.downTurnFrames[0];
    }

    this.improptFrames.push(...frame);

    this.velocity[this.orientation ? this.K_RIGHT : this.K_LEFT] = this.speed;
    this.velocity[this.orientation ? this.K_LEFT : this.K_RIGHT] = 0;
  }

  transPhase2() {
    this.loadSpritesPhase2();
    this.loadSoundsPhase2();

    this.transSounds[0][0].play();

    this.hp = 75;
    this.phase = 2;

    this.renderShadow = [];
    this.turningFrames = [];
    this.prepFrames = [];
    this.improptFrames = [];

    this.groundShadowLevel = 3.5;
  }

  transPhase3() {
    this.phase = 3;
    this.isDizzy = true;

    this.deathSound[0][0].play();
    this.deathFallSound[0][0].play();

    tomb.x = this.drawX + this.drawW / 2;
    tomb.y = -3500;

    unshiftObject(tomb);
    enemy = tomb;
  }

  renderDusts() {
    this.renderDust.push(...this.dustFrames[0]);
  }

  explode() {
    this.renderExplosion.push(...this.blowUpFrames[0]);
  }

  jump() {
    if (this.isGrounded() && !this.isJumping) {
      let i = Math.floor(Math.random() * this.jumpSounds[1]);
      this.jumpSounds[0][i].play();
      if (this.hp < 0) {
        switch (this.phase) {
          case 1:
            this.transPhase2();
            break;
          case 2:
            this.transPhase3();
            break;
        }
        return;
      }

      this.improptFrames = [];
      this.prepFrames.push(...this.preJumpFrames[0]);

      let randomSpd =
        this.jumpSpeed +
        (Math.random() > 0.5 ? this.jumpSpeedDiff : -this.jumpSpeedDiff);
      this.velocity[this.K_UP] = randomSpd;
      this.velocity[this.orientation ? this.K_RIGHT : this.K_LEFT] = this.speed;

      this.isJumping = true;

      this.renderShadow = [];
      this.renderShadow.push(...this.shadowFrames[0]);
    }
  }

  update() {
    if (isFrozen) {
      return;
    }

    super.update();

    let vX = this.velocity[this.K_RIGHT] - this.velocity[this.K_LEFT];
    let rX = this.x + vX;

    let vY = this.velocity[this.K_DOWN] - this.velocity[this.K_UP];
    let rY = this.y + vY;

    this.x = this.isGrounded() ? this.x : rX;
    this.y =
      this.prepFrames.length > 0
        ? this.y
        : rY > canvasHeight - groundLevel
        ? canvasHeight - groundLevel
        : rY;

    if (!this.isGrounded()) {
      this.velocity[this.K_DOWN] += this.localGravity;
    } else {
      if (this.turningFrames.length == 0) {
        this.turningFrames.push(...this.upDownTransFrames[0]);
      }

      if (this.prepFrames.length == 0) {
        this.velocity[this.K_DOWN] = 0;
        this.velocity[this.K_UP] = 0;
        if (this.isJumping == true) {
          this.renderDusts();
          this.landSounds[0][
            Math.floor(Math.random() * this.jumpSounds[1])
          ].play();

          shake(this.phase == 2 ? 5 : 3);
        }

        this.isJumping = false;
      }

      this.improptFrames = [];
    }

    if (this.introFrames[0].length == 0 && this.isGrounded() && !this.isDizzy) {
      this.jump();
    }

    if (
      vY > 0 &&
      canvasHeight - groundLevel - (this.drawY + this.drawH) <
        this.groundShadowLevel * groundLevel
    ) {
      if (this.renderShadow.length == 0) {
        this.renderShadow = [];
        this.renderShadow.push(...this.shadowFrames[0].reverse());
        this.shadowFrames[0].reverse();
      }
    }

    if (this.checkWalled()) {
      this.walled();
    }
  }

  changeOrientation(or) {
    if (this.orientation == or) {
      return;
    }

    if (!this.orientation && or) {
      this.x -= this.drawW;
    } else if (this.orientation && !or) {
      this.x += this.drawW;
    }

    this.orientation = or;
  }

  render(ctx) {
    super.render(ctx);
    ctx.save();

    let offset = -(player.x - canvasWidth / 2) * 0.02;

    let frame;
    let fr;

    if (this.isDizzy) {
      fr = this.dizzyFrames[0][this.tick % this.dizzyFrames[1]];
    } else if (this.introFrames[0].length > 0) {
      fr = this.introFrames[0].shift();
    } else {
      if (
        !this.isGrounded() &&
        Math.abs(this.velocity[this.K_DOWN] - this.velocity[this.K_UP]) <
          30 * this.scale &&
        this.turningFrames.length > 0
      ) {
        fr = this.turningFrames.shift();
        if (this.improptFrames.length > 0) {
          this.improptFrames = [];
        }
      } else {
        if (this.prepFrames.length > 0) {
          fr = this.prepFrames.shift();
        } else if (this.improptFrames.length > 0) {
          fr = this.improptFrames.shift();
        } else if (this.velocity[this.K_DOWN] > this.velocity[this.K_UP]) {
          frame = this.downFrames;
          fr = frame[0][this.tick % frame[1]];
        } else if (this.velocity[this.K_DOWN] < this.velocity[this.K_UP]) {
          frame = this.upFrames;
          fr = frame[0][this.tick % frame[1]];
        }
      }
    }
    this.drawW = fr.width * this.scale;
    this.drawH = fr.height * this.scale;

    this.w = this.drawW;
    this.h = this.drawH;

    this.hbHeight = this.drawH * 0.8;
    this.hbWidth = this.drawW * 0.6;

    this.drawX = this.x - this.drawW;
    this.drawY = this.y - this.drawH;

    if (this.isDizzy) {
      this.drawX += 80 * this.scale;
    }

    // if (this.phase == 2) {
    //   this.drawX = this.x - (this.orientation ? this.drawW : 0);
    // }

    if (this.orientation) {
      ctx.scale(-1, 1);

      this.drawX = this.drawX - this.x * 2;
    }

    this.hbX = this.drawX + this.drawW / 2 - this.hbWidth / 2;
    this.hbY = this.drawY + this.drawH / 2 - this.hbHeight / 2;

    let shadowFr;

    if (!this.isGrounded()) {
      shadowFr = this.renderShadow.shift();
    }

    if (shadowFr && !this.isGrounded()) {
      let shW = shadowFr.width * this.scale;
      let shH = shadowFr.height * this.scale;

      let shX = this.drawX + this.drawW / 2 - shW / 2;
      let shY = canvasHeight - groundLevel * 1.23 - shH / 2;

      ctx.drawImage(shadowFr, shX + offset, shY, shW, shH);
    }

    if (this.renderExplosion.length > 0) {
      let d = this.renderExplosion.shift();
      let dW = d.width * this.scale;
      let dH = d.height * this.scale;

      let dX = this.drawX + this.drawW / 2 - dW / 2;
      let dY = canvasHeight - groundLevel * 1.23 - dH / 2;

      ctx.drawImage(d, dX, dY - 220, dW, dH);

      if (this.renderExplosion.length == 0) {
        this.isDied = true;
      }
    } else {
      ctx.drawImage(
        fr,
        this.drawX + offset,
        this.drawY,
        this.drawW,
        this.drawH
      );
    }

    if (this.renderDust.length > 0) {
      let dscale = 1;
      if (this.phase == 1) {
        dscale = 0.5;
      }
      let d = this.renderDust.shift();
      let dW = d.width * this.scale * dscale;
      let dH = d.height * this.scale * dscale;

      let dX = this.drawX + this.drawW / 2 - dW / 2;
      let dY = canvasHeight - groundLevel * 1.23 - dH / 2;

      ctx.drawImage(d, dX + offset, dY, dW, dH);
    }

    if (this.orientation) {
      this.drawX = this.drawX + this.x * 2 + this.drawW;
    }

    ctx.restore();
  }
}
