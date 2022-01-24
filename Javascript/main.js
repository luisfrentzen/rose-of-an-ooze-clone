var fps;
var fpsInterval;
var then;
var startTime;
var currentFrame;
var elapsed;

var renderQueue;

var dpr;
var ctx;

var id = 1;

var canvasWidth = 1080;
var canvasHeight = 607;

var groundLevel = 70;

const GLOBAL_SCALE = 0.88;
const K_LEFT = 37;
const K_UP = 38;
const K_RIGHT = 39;
const K_DOWN = 40;
const K_LEFT_SHIFT = 16;
const K_Z = 90;
const K_X = 88;
const K_C = 67;

var ST_LEFT = false;
var ST_RIGHT = false;
var ST_UP = false;
var ST_DOWN = false;

var keyFired = [];

var player;
var environment;
var goopy;
var screenfx;
var enemy;

const GRAVITY = 10;

var shakeFrames;

function onKeyUp(e) {
  if (!isStarted || isPaused || isFrozen) {
    return;
  }

  let k = e.keyCode;

  switch (k) {
    case K_LEFT:
      player.stop(player.K_LEFT);
      ST_LEFT = false;
      break;
    case K_RIGHT:
      player.stop(player.K_RIGHT);
      ST_RIGHT = false;
      break;
    case K_DOWN:
      player.unDuck();
      ST_DOWN = false;
      break;
    case K_UP:
      ST_UP = false;
      break;
    case K_C:
      player.unAim();
      break;
    case K_X:
      player.unShoot();
      break;
  }

  let dir = 0;

  if (player.isShooting) {
    if (ST_DOWN && (ST_RIGHT || ST_LEFT)) {
      dir = player.S_DDOWN;
    } else if (ST_UP && (ST_RIGHT || ST_LEFT)) {
      dir = player.S_DUP;
    } else if (ST_UP) {
      dir = player.S_UP;
    }
  }

  if (!ST_DOWN && !ST_UP && !ST_RIGHT && !ST_LEFT) {
    player.changeShootingDir(player.S_STRAIGHT);
  }

  player.changeShootingDir(dir);

  let i = keyFired.indexOf(k);
  keyFired.splice(i, 1);
}

function onKeyDown(e) {
  if (!isStarted || isPaused || isFrozen) {
    return;
  }

  let k = e.keyCode;

  switch (k) {
    case K_LEFT:
      if (!player.orientation && player.isDucking) {
        player.changeOrientation(1);
      }

      player.move(player.K_LEFT);
      player.stop(player.K_RIGHT);
      ST_LEFT = true;
      break;
    case K_RIGHT:
      if (player.orientation && player.isDucking) {
        player.changeOrientation(0);
      }

      player.move(player.K_RIGHT);
      player.stop(player.K_LEFT);
      ST_RIGHT = true;
      break;
    case K_DOWN:
      player.duck();
      ST_DOWN = true;
      break;
    case K_UP:
      ST_UP = true;
      break;
    case K_Z:
      if (!keyFired.includes(k)) {
        if (player.isGrounded()) {
          player.jump();
        } else {
          player.parry();
        }
      }
      break;
    case K_LEFT_SHIFT:
      if (!keyFired.includes(k)) {
        player.dash();
      }
      break;
    case K_X:
      player.shoot();
      break;
    case K_C:
      player.aim();
      break;
  }

  let dir = 0;

  if (player.isShooting) {
    if (ST_DOWN && (ST_RIGHT || ST_LEFT)) {
      dir = player.S_DDOWN;
    } else if (ST_UP && (ST_RIGHT || ST_LEFT)) {
      dir = player.S_DUP;
    } else if (ST_UP) {
      dir = player.S_UP;
    }
  }

  player.changeShootingDir(dir);

  if (!keyFired.includes(k)) {
    keyFired.push(k);
  }
}

var soundQueue;

var isSoundPlaying;

var bgMusic;
var staticSound;

var announcerPre;
var announcerPost;
var introBell;

var globalVolume;

var isPaused;
var isStarted;
var isFrozen;

var showHitboxes;

function toggleTutorialModal() {
  let t = document.getElementById("tutorial-container");
  t.style.display = t.style.display == "flex" ? "none" : "flex";
}

function onEnded(e) {
  isSoundPlaying = false;
}

function addSound(sound) {
  sound.onended = onEnded;
  sound.volume = globalVolume;

  soundQueue.push(sound);
}

function loadMusic() {
  bgMusic = getSound("sound-bg-music");
  bgMusic.volume = globalVolume;

  staticSound = getSound("sound-optical-loop");

  announcerPre = getSounds("sound-announcer-pre");
  announcerPost = getSounds("sound-announcer-post");

  introBell = getSounds("sound-misc-intro-bell");
}

function getSound(id) {
  return document.getElementById(id);
}

function getSounds(cls) {
  let s = document.getElementsByClassName(cls);
  return [s, s.length];
}

function getContext(canvas, dpr, width = 800, height = 600) {
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  canvas.height = height * dpr;
  canvas.width = width * dpr;

  canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);

  return canvas.getContext("2d");
}

function addObject(object) {
  renderQueue.push(object);
}

function unshiftObject(object) {
  renderQueue.unshift(object);
}

function render() {
  if (shakeFrames.length != 0) {
    ctx.translate(shakeFrames[0][0], shakeFrames[0][1]);
    shakeFrames.shift();

    if (shakeFrames.length == 0) ctx.restore();
  }

  environment.renderBackground(ctx, player.x);
  environment.renderMiddleground(ctx, player.x);

  for (obj of renderQueue) {
    obj.render(ctx);
  }

  environment.renderForeground(ctx, player.x);
  announcer.render(ctx);
  screenfx.render(ctx);
  destroyDiedObject();
}

function diedObjectFilter(e) {
  return !e.isDied;
}

function destroyDiedObject() {
  renderQueue = renderQueue.filter(diedObjectFilter);
}

function update() {
  for (obj of renderQueue) {
    obj.update();
  }
}

function clearFrame() {
  ctx.save();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.restore();
}

function loop(now) {
  if (!isStarted) {
    return;
  }

  currentFrame = window.performance.now();
  elapsed = currentFrame - then;

  if (elapsed > fpsInterval) {
    if (!isPaused) {
      then = currentFrame - (elapsed % fpsInterval);
      clearFrame();
      render(now);

      if (!isSoundPlaying && soundQueue.length > 0) {
        let s = soundQueue.shift();
        s.play();
        isSoundPlaying = true;
      }
    }
  }

  requestAnimationFrame(loop);
}

function shake(frameCount) {
  ctx.save();

  let fr = [];
  for (let i = 0; i < frameCount - 1; i++) {
    let dx = (Math.random() * 2 - 1) * (2 + goopy.phase);
    let dy = (Math.random() * 2 - 1) * (2 + goopy.phase);
    fr.push([dx, dy]);
  }

  shakeFrames.push(...fr);
}

function changeFps(fps) {
  fps = fps;
  fpsInterval = 1000 / fps;
}

function initialize() {
  fps = 21;
  fpsInterval = 1000 / fps;
  then = window.performance.now();
  startTime = then;

  isSoundPlaying = false;
  isFrozen = false;
  isPaused = false;
  isStarted = false;
  showHitboxes = false;

  globalVolume = 0.65;

  shakeFrames = [];
  renderQueue = [];
  soundQueue = [];

  loadMusic();

  dpr = Math.ceil(window.devicePixelRatio);
  ctx = getContext(
    document.getElementById("canv"),
    dpr,
    canvasWidth,
    canvasHeight
  );

  window.addEventListener("keyup", onKeyUp, false);
  window.addEventListener("keydown", onKeyDown, false);

  // announcer
  announcer = new Announcer(0, 0, 0, 0);

  // environment
  environment = new Environment(0, 0, 0, 0);

  // goopy
  goopy = new Goopy(
    canvasWidth * 0.84,
    canvasHeight - groundLevel,
    212,
    234,
    GLOBAL_SCALE
  );
  addObject(goopy);

  enemy = goopy;

  // player
  player = new Player(
    canvasWidth * 0.12,
    canvasHeight - groundLevel,
    98,
    155,
    GLOBAL_SCALE
  );
  addObject(player);

  // tomb goopy
  tomb = new TombGoopy(0, 0, 0, 0, GLOBAL_SCALE);

  // fx
  screenfx = new ScreenFX(0, 0, 0, 0, 1);
}

function main() {
  initialize();
}

function killGame() {
  initialize();
  ctx.clearFrame;

  isStarted = false;

  let sounds = document.getElementsByTagName("audio");
  for (i = 0; i < sounds.length; i++) {
    sounds[i].pause();
    sounds[i].currentTime = 0;
  }
}

function pauseSounds() {
  let sounds = document.getElementsByTagName("audio");
  for (i = 0; i < sounds.length; i++) sounds[i].pause();
}

function resumeSounds() {
  let sounds = document.getElementsByTagName("audio");
  for (i = 0; i < sounds.length; i++) {
    if (
      sounds[i].paused &&
      sounds[i].currentTime != 0 &&
      sounds[i].currentTime != sounds[i].duration
    )
      sounds[i].play();
  }
}

function pauseGame() {
  if (!isStarted) {
    return;
  }

  if (isPaused) {
    resumeSounds();
  } else {
    pauseSounds();
  }

  isPaused = !isPaused;
}

function playGame() {
  let b = document.getElementById("play-button");
  b.disabled = true;

  isStarted = true;

  bgMusic.play();
  bgMusic.loop = true;

  staticSound.play();
  staticSound.loop = true;

  // random announcer
  let pre = announcerPre[0][Math.floor(Math.random() * announcerPre[1])];
  let post = announcerPost[0][Math.floor(Math.random() * announcerPost[1])];

  addSound(pre);
  addSound(post);

  requestAnimationFrame(loop);
}

main();
