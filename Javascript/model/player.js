class Player extends GameObject {
  constructor(x, y, w, h, scale = 1) {
    super(x, y, w, h, scale);

    this.idleFrames = [[], 0];
    this.runFrames = [[], 0];
    this.turningFrames = [[], 0];
    this.duckIdleFrames = [[], 0];
    this.duckingFrames = [[], 0];
    this.standDuckFrames = [[], 0];
    this.jumpingFrames = [[], 0];
    this.parryFrames = [[], 0];
    this.dashFrames = [[], 0];
    this.turningDuckFrames = [[], 0];
    this.dashAirFrames = [[], 0];
    this.takeDamageFrames = [[], 0];
    this.takeDamageAirFrames = [[], 0];
    this.takeDamageRender = [];

    this.hp = 2;
    this.vulnFrames = 0;
    this.dashingVulnFrames = 0;

    this.bulletSpawnFrames = [[], 0];

    this.S_STRAIGHT = 0;
    this.S_DUP = 1;
    this.S_UP = 2;
    this.S_DDOWN = 3;
    this.S_DOWN = 4;

    this.shootDuckFrame = [[], 0];

    this.shootBoilFrames = [
      [[], 0],
      [[], 0],
      [[], 0],
      [[], 0],
      [[], 0],
    ];
    this.shootFrames = [
      [[], 0],
      [[], 0],
      [[], 0],
      [[], 0],
      [[], 0],
    ];
    this.shootRunFrames = [
      [[], 0],
      [[], 0],
    ];
    this.shootDuckBoilFrame = [[], 0];

    this.introFrames = [];
    this.improptFrames = [];
    this.turningFrames = [];
    this.dashingFrames = [];
    this.parryingFrames = [];
    this.bulletStartupFrames = [];

    this.isRunning = false;
    this.isDucking = false;
    this.isJumping = false;
    this.isAiming = false;
    this.isShooting = false;
    this.affectGravity = true;
    this.fireCooldown = 3;
    this.currentFireCooldown = 0;

    this.hasDied = false;

    this.trueW = this.w;
    this.trueH = this.h;

    this.boundingW = this.w;
    this.boundingH = this.h;

    this.bulletScale = 0.95 * this.scale;

    this.shootDir = this.S_STRAIGHT;

    this.dashSpeed = 40 * this.scale;
    this.speed = 20 * this.scale;
    this.jumpSpeed = 80 * this.scale;
    this.bulletSpeed = 70 * this.bulletScale;
    this.orientation = 0;

    this.playerStartShootingSound = null;
    this.playerShootingSound = null;
    this.playerJumpSound = null;
    this.playerDashSound = null;
    this.playerLandSound = null;
    this.playerDeathSound = null;
    this.playerCrackSound = null;
    this.playerHitSound = null;

    this.loadSprites();
    this.loadSounds();
  }

  loadSounds() {
    this.playerStartShootingSound = this.getSounds("sound-player-shoot");
    this.playerShootingSound = this.getSounds("sound-player-shoot-loop");
    this.playerHitSound = this.getSounds("sound-player-hit");
    this.playerDashSound = this.getSounds("sound-player-dash");
    this.playerJumpSound = this.getSounds("sound-player-jump");
    this.playerLandSound = this.getSounds("sound-player-land");
    this.playerDeathSound = this.getSounds("sound-player-death");
    this.playerCrackSound = this.getSounds("sound-player-crack");

    this.playerStartShootingSound[0][0].volume = 0.125;
    this.playerShootingSound[0][0].volume = 0.125;
    this.playerHitSound[0][0].volume = 0.25;
    this.playerCrackSound[0][0].volume = 0.25;
    this.playerDeathSound[0][0].volume = 0.5;
    this.playerLandSound[0][0].volume = 0.5;
    this.playerDashSound[0][0].volume = 0.5;
    this.playerJumpSound[0][0].volume = 0.5;

    this.playerShootingSound[0][0].loop = true;
  }

  loadSprites() {
    this.bulletSpawnFrames = this.getSprites("texture-bullet-spawn");

    this.idleFrames = this.getSprites("texture-cuphead-idle");
    this.runFrames = this.getSprites("texture-cuphead-run");
    this.turningFrames = this.getSprites("texture-cuphead-turn-around");
    this.duckIdleFrames = this.getSprites("texture-cuphead-duck-idle");
    this.duckingFrames = this.getSprites("texture-cuphead-ducking");
    this.standDuckFrames = this.getSprites("texture-cuphead-duck-stand");
    this.jumpingFrames = this.getSprites("texture-cuphead-jumping");
    this.parryFrames = this.getSprites("texture-cuphead-parry");
    this.dashFrames = this.getSprites("texture-cuphead-dash");
    this.turningDuckFrames = this.getSprites("texture-cuphead-turn-duck");
    this.dashAirFrames = this.getSprites("texture-cuphead-dash-air");
    this.takeDamageFrames = this.getSprites("texture-cuphead-hit");
    this.takeDamageAirFrames = this.getSprites("texture-cuphead-hit-air");

    this.shootFrames[this.S_UP] = this.getSprites("texture-cuphead-shoot-up");
    this.shootFrames[this.S_DUP] = this.getSprites("texture-cuphead-shoot-dup");
    this.shootFrames[this.S_DDOWN] = this.getSprites(
      "texture-cuphead-shoot-ddown"
    );
    this.shootFrames[this.S_DOWN] = this.getSprites(
      "texture-cuphead-shoot-down"
    );
    this.shootFrames[this.S_STRAIGHT] = this.getSprites(
      "texture-cuphead-shoot-straight"
    );
    this.shootDuckFrame = this.getSprites("texture-cuphead-shoot-duck");

    this.shootBoilFrames[this.S_UP] = this.getSprites(
      "texture-cuphead-shoot-up-boil"
    );
    this.shootBoilFrames[this.S_DUP] = this.getSprites(
      "texture-cuphead-shoot-dup-boil"
    );
    this.shootBoilFrames[this.S_DDOWN] = this.getSprites(
      "texture-cuphead-shoot-ddown-boil"
    );
    this.shootBoilFrames[this.S_DOWN] = this.getSprites(
      "texture-cuphead-shoot-down-boil"
    );
    this.shootBoilFrames[this.S_STRAIGHT] = this.getSprites(
      "texture-cuphead-shoot-straight-boil"
    );
    this.shootDuckBoilFrame = this.getSprites(
      "texture-cuphead-shoot-duck-boil"
    );

    this.shootRunFrames[this.S_DUP] = this.getSprites(
      "texture-cuphead-run-shoot-dup"
    );
    this.shootRunFrames[this.S_STRAIGHT] = this.getSprites(
      "texture-cuphead-run-shoot"
    );

    this.introFrames = this.getSprites("texture-cuphead-intro");
  }

  isDashing() {
    return this.dashingFrames.length > 0;
  }

  isParrying() {
    return this.parryingFrames.length > 0;
  }

  dash() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (!this.isDashing() && !this.isParrying()) {
      let frames = this.isGrounded() ? this.dashFrames : this.dashAirFrames;
      this.playerDashSound[0][0].play();
      this.dashingVulnFrames = frames[1] * 2;
      this.dashingFrames.push(...frames[0]);
    }
  }

  parry() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (!this.isParrying()) {
      this.parryingFrames.push(...this.parryFrames[0]);
    }
  }

  jump() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (this.isGrounded()) {
      this.playerJumpSound[0][0].play();
      this.isJumping = true;
      this.isDucking = false;
      this.velocity[this.K_UP] = this.jumpSpeed;
      this.improptFrames = [];
    }
  }

  aim() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (this.isShooting && this.isGrounded() && !this.isDashing()) {
      this.isAiming = true;
    }
  }

  unAim() {
    this.isAiming = false;
  }

  shoot() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (!this.isDashing()) {
      this.playerShootingSound[0][0].play();
      this.isShooting = true;
    }
  }

  unShoot() {
    this.playerShootingSound[0][0].pause();
    this.isShooting = false;
    this.currentFireCooldown = 0;
  }

  changeOrientation(or) {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (!this.isDashing()) {
      if (this.orientation != or && this.isGrounded()) {
        let frames = this.isDucking
          ? this.turningDuckFrames
          : this.turningFrames;
        this.improptFrames.push(...frames[0]);
      }

      this.orientation = or;
    }
  }

  changeShootingDir(dir) {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (
      (this.isRunning && ![this.S_DUP, this.S_STRAIGHT].includes(dir)) ||
      !this.isGrounded()
    ) {
      dir = this.S_STRAIGHT;
    }

    this.shootDir = dir;
  }

  duck() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (this.isGrounded() && !this.isJumping && !this.isAiming) {
      if (!this.isDucking) {
        this.improptFrames.push(...this.duckingFrames[0]);
      }

      this.isDucking = true;
      this.stopAll();
    }
  }

  unDuck() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (this.isDucking) {
      this.improptFrames = [];
      this.improptFrames.push(...this.standDuckFrames[0]);
      this.isDucking = false;
    }
  }

  move(key) {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (this.isDucking) {
      return;
    }

    this.velocity[key] = this.speed;
  }

  stop(key) {
    this.velocity[key] = 0;
  }

  stopAll() {
    for (let i = 0; i < 4; i++) {
      this.velocity[i] = 0;
    }

    this.isRunning = false;
  }

  fire() {
    if (this.introFrames[0].length > 0) {
      return;
    }

    if (this.currentFireCooldown == 0) {
      let dir = this.isDucking ? this.S_STRAIGHT : this.shootDir;

      let divY = 2;

      switch (dir) {
        case this.S_DUP:
          divY = 1.6;
          break;
        case this.S_DDOWN:
          divY = 2.6;
          break;
      }

      addObject(
        new Bullet(
          this.x +
            (this.orientation ? 0 : this.trueW) +
            (this.isDucking ? (!this.orientation ? 80 : -80) * this.scale : 0),
          this.y - this.h / divY,
          54,
          37,
          this.bulletScale,
          dir,
          this.orientation,
          this.bulletSpeed
        )
      );
      this.currentFireCooldown = this.fireCooldown;
    }

    this.currentFireCooldown--;
  }

  isTakingDamage() {
    return this.takeDamageRender.length > 0;
  }

  takeDamage() {
    this.playerHitSound[0][0].play();
    this.playerCrackSound[0][0].play();
    this.takeDamageRender.push(
      ...(this.isGrounded()
        ? this.takeDamageFrames[0]
        : this.takeDamageAirFrames[0])
    );

    this.hp--;

    this.affectGravity = false;

    if (this.hp < 0) {
      this.die();
    }

    this.vulnFrames = 63;
  }

  die() {
    this.hasDied = true;
    this.playerDeathSound[0][0].play();
    this.unShoot();
    this.unDuck();
    announcer.playerDie();
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

    if (this.isDashing()) {
      this.x += this.dashSpeed * (this.orientation ? -1 : 1);

      if (this.x < 0) {
        this.x = 0;
      }

      if (this.x > canvasWidth * 0.92) {
        this.x = canvasWidth * 0.92;
      }

      this.affectGravity = false;
    } else {
      if (vX > 0 && this.orientation) {
        this.changeOrientation(0);
      } else if (vX < 0 && !this.orientation) {
        this.changeOrientation(1);
      }

      if (!this.isAiming) {
        this.x =
          rX + this.w > canvasWidth ? canvasWidth - this.w : rX < 0 ? 0 : rX;
        this.y =
          rY > canvasHeight - groundLevel ? canvasHeight - groundLevel : rY;

        this.affectGravity = true;
      }
    }

    if (this.vulnFrames > 0) {
      this.vulnFrames--;
    }

    if (this.dashingVulnFrames > 0) {
      this.dashingVulnFrames--;
    }

    if (
      this.isShooting &&
      this.improptFrames.length == 0 &&
      !this.isParrying() &&
      !this.isDashing()
    ) {
      this.fire();
    }

    if (this.isTakingDamage()) {
      this.affectGravity = false;
    }

    if (!this.isGrounded() && this.affectGravity) {
      this.velocity[this.K_DOWN] += GRAVITY;
    } else {
      this.velocity[this.K_DOWN] = 0;
      this.velocity[this.K_UP] = 0;
      if (this.isJumping) {
        this.playerLandSound[0][0].play();
      }

      this.isJumping = false;
      this.parryingFrames = [];
    }

    this.isRunning = this.isAiming
      ? false
      : this.velocity.includes(this.speed)
      ? true
      : false;

    if (this.vulnFrames == 0 && this.dashingVulnFrames == 0) {
      if (this.isCollidedWith(enemy)) {
        this.takeDamage();
      }
    }
  }

  render(ctx) {
    super.render(ctx);
    ctx.save();

    if (this.vulnFrames > 0 && Math.floor(this.vulnFrames / 2) % 2 == 0) {
      ctx.globalAlpha = 0.5;
    }

    let frames;
    let fr;

    if (this.isTakingDamage()) {
      fr = this.takeDamageRender.shift();
    } else if (this.introFrames[0].length > 0) {
      fr = this.introFrames[0].shift();
    } else if (this.dashingFrames.length > 0) {
      fr = this.dashingFrames.shift();
    } else if (this.improptFrames.length > 0) {
      fr = this.improptFrames.shift();
    } else {
      if (!this.isGrounded()) {
        frames = this.jumpingFrames;
        fr = this.isParrying()
          ? this.parryingFrames.shift()
          : frames[0][this.tick % frames[1]];
      } else if (this.isRunning) {
        let sdir = this.shootDir;

        if (![this.S_DUP, this.S_STRAIGHT].includes(this.shootDir)) {
          sdir = this.S_STRAIGHT;
        }
        frames = this.isShooting ? this.shootRunFrames[sdir] : this.runFrames;
        fr = frames[0][this.tick % frames[1]];
      } else if (this.isDucking) {
        frames = this.isShooting ? this.shootDuckFrame : this.duckIdleFrames;
        fr = frames[0][this.tick % frames[1]];
      } else {
        frames = this.isShooting
          ? this.shootFrames[this.shootDir]
          : this.idleFrames;
        fr = frames[0][this.tick % frames[1]];
      }
    }

    this.drawW = fr.width * this.scale;
    this.drawH = fr.height * this.scale;

    this.w = this.drawW;
    this.h = this.drawH;

    this.drawX = this.x;
    this.drawY = this.y - this.drawH;

    if (
      this.isShooting &&
      !this.isDashing() &&
      !this.isParrying() &&
      this.improptFrames.length == 0
    ) {
      ctx.save();
      let b_fr =
        this.bulletSpawnFrames[0][this.tick % this.bulletSpawnFrames[1]];

      let dir = this.isDucking ? this.S_STRAIGHT : this.shootDir;

      let divY = 2;

      switch (dir) {
        case this.S_DUP:
          divY = 1.6;
          break;
        case this.S_DDOWN:
          divY = 2.6;
          break;
      }

      let b_x =
        this.x +
        (this.orientation ? 0 : this.trueW) +
        (this.isDucking ? (!this.orientation ? 80 : -80) * this.scale : 0);
      let b_y = this.y - this.h / divY;

      let drawB_w = b_fr.width * this.bulletScale;
      let drawB_h = b_fr.height * this.bulletScale;

      let drawB_x = b_x - drawB_w / 2;
      let drawB_y = b_y - drawB_h / 2;

      ctx.translate(b_x, b_y);

      let deg = 0;

      switch (dir) {
        case this.S_STRAIGHT:
          drawB_x +=
            (15 + (this.isDucking ? -35 : 0)) *
            (this.orientation ? -1 : 1) *
            this.scale;
          break;
        case this.S_UP:
          drawB_x += 70 * (this.orientation ? -1 : 1) * this.scale;
          drawB_y -= 10 * this.scale;
          deg = Math.PI * 0.5 * (this.orientation ? 1 : -1);
          break;
        case this.S_DUP:
          drawB_x += 40 * (this.orientation ? -1 : 1) * this.scale;
          deg = Math.PI * 0.25 * (this.orientation ? 1 : -1);
          break;
        case this.S_DOWN:
          deg = Math.PI * 0.5 * (this.orientation ? -1 : 1);
          break;
        case this.S_DDOWN:
          drawB_x += 40 * (this.orientation ? -1 : 1) * this.scale;
          deg = Math.PI * 0.25 * (this.orientation ? -1 : 1);
          break;
      }

      if (this.isRunning) {
        drawB_y += 10 * this.scale;
      }

      ctx.rotate(deg);

      ctx.translate(-b_x, -b_y);

      if (this.orientation) {
        ctx.scale(-1, 1);

        drawB_x = drawB_x * -1 - drawB_w;
      }

      ctx.drawImage(b_fr, drawB_x, drawB_y, drawB_w, drawB_h);
      ctx.restore();
    }

    if (this.orientation) {
      ctx.scale(-1, 1);

      this.drawX = this.drawX * -1 - this.trueW;
    }

    let stillDucking = fr.className == "texture-cuphead-duck-stand";

    this.drawX =
      this.drawX -
      (this.isShooting || this.isDucking || stillDucking
        ? 0
        : this.drawW - this.trueW);
    this.boundingW = this.drawW;
    this.boundingH = this.drawH;

    this.hbWidth = this.trueW;
    this.hbHeight = this.trueH;

    this.hbX = this.drawX;
    this.hbY = this.drawY;

    ctx.drawImage(fr, this.drawX, this.drawY, this.drawW, this.drawH);
    ctx.restore();
  }
}
