class Announcer extends GameObject {
  constructor(x, y, w, h, scale = 1) {
    super(x, y, w, h, (scale = 1));

    this.iris = [];
    this.knockout = [];
    this.getready = [];
    this.youdied = [];

    this.frameQueue = [];

    this.playerDied = false;
    this.playerWon = false;
    this.wonTick = -1;

    this.knockoutSound = [];
    this.knockoutBellSound = [];
    this.knockoutBoomSound = [];

    this.loadSprites();
    this.frameToKill = -1;

    this.frameQueue = [...this.iris[0], ...this.getready[0]];

    this.loadSounds();
  }

  loadSounds() {
    this.knockoutSound = this.getSounds("sound-announcer-knockout");
    this.knockoutBellSound = this.getSounds("sound-misc-knockout-bell");
    this.knockoutBoomSound = this.getSounds("sound-misc-knockout-boom");

    this.knockoutSound[0][0].volume = globalVolume;
    this.knockoutBellSound[0][0].volume = globalVolume;
    this.knockoutBoomSound[0][0].volume = globalVolume;
  }

  loadSprites() {
    this.iris = this.getSprites("texture-misc-iris");
    this.knockout = this.getSprites("texture-misc-knockout");
    this.getready = this.getSprites("texture-misc-getready");
    this.youdied = this.getSprites("texture-misc-youdied");
  }

  playerDie() {
    this.playerDied = true;
    isFrozen = true;
  }

  playerWin() {
    this.playerWon = true;
    isFrozen = true;
    player.unShoot();
    player.stopAll();

    this.knockoutSound[0][0].play();
    this.knockoutBellSound[0][0].play();
    this.knockoutBoomSound[0][0].play();

    this.frameQueue.push(...this.knockout[0]);
    this.wonTick = this.tick;
  }

  update() {
    super.update();

    if (this.frameToKill > 0) {
      this.frameToKill--;

      if (this.frameToKill == 0) {
        killGame();
      }
    }
  }

  render(ctx) {
    super.render(ctx);

    ctx.save();

    let fr = this.frameQueue.shift();

    if (this.playerDied) {
      let d = this.youdied[0][0];
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.globalAlpha = 1;

      let drawX = 0;
      let drawY = 0;

      let drawW = canvasWidth;
      let drawH = (d.height * drawW) / d.width;

      drawY = canvasHeight / 2 - drawH / 2;

      ctx.drawImage(d, drawX, drawY, drawW, drawH);

      if (bgMusic.volume > 0) {
        let v = bgMusic.volume;

        v -= 0.01;
        if (v < 0) {
          v = 0;
          this.frameQueue.push(...this.iris[0].reverse());
          this.iris[0].reverse();

          this.frameToKill = this.iris[1];
        }

        bgMusic.volume = v;
      }
    } else if (this.playerWon) {
      if (!fr) {
        isFrozen = false;
      }

      if (this.tick - this.wonTick > 63) {
        if (bgMusic.volume > 0) {
          let v = bgMusic.volume;

          v -= 0.015;
          if (v < 0) {
            v = 0;
            this.frameQueue.push(...this.iris[0].reverse());
            this.iris[0].reverse();

            this.frameToKill = this.iris[1];
          }

          bgMusic.volume = v;
        }
      }
    }

    if (fr) ctx.drawImage(fr, 0, 0, canvasWidth, canvasHeight);

    ctx.restore();
  }
}
